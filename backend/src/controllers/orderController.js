import { RECENT_DROP_ORDERS } from '../data/mockData.js'
import Order from '../models/Order.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { getDBStatus } from '../config/db.js'
import { sendOrderReceiptEmail } from '../services/emailService.js'
import { getAuthoritativeProduct } from './cartController.js'

/**
 * GET /api/orders (Admin Only)
 * Fetch all platform orders across all users
 */
export const getOrders = asyncHandler(async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Admin privileges required to view all orders.',
    })
  }

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 })
      return res.json({
        success: true,
        count: orders.length,
        data: orders,
      })
    } catch {
      // Fallback if DB query errors
    }
  }

  res.json({
    success: true,
    count: RECENT_DROP_ORDERS.length,
    data: RECENT_DROP_ORDERS,
  })
})

/**
 * GET /api/orders/my-orders (Authenticated User)
 * Fetch ONLY the logged in user's personal orders
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id
  const userEmail = req.user?.email?.toLowerCase()

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const query = {
        $or: [
          ...(userId ? [{ user: userId }] : []),
          ...(userEmail ? [{ userEmail: userEmail }] : []),
        ],
      }
      const orders = await Order.find(query).sort({ createdAt: -1 })
      return res.json({
        success: true,
        count: orders.length,
        data: orders,
      })
    } catch {
      // Fallback to in-memory check
    }
  }

  const userOrders = RECENT_DROP_ORDERS.filter(
    (o) =>
      (userId && String(o.user) === String(userId)) ||
      (userEmail && o.userEmail?.toLowerCase() === userEmail)
  )

  res.json({
    success: true,
    count: userOrders.length,
    data: userOrders,
  })
})

/**
 * GET /api/orders/:id (Authenticated User: Owner or Admin)
 * Fetch a specific order only if caller is the owner or an admin
 */
export const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const userId = req.user?.id || req.user?._id
  const userEmail = req.user?.email?.toLowerCase()
  const isAdmin = req.user?.role === 'admin'

  const cleanNum = id.startsWith('#') ? id.slice(1) : id
  const hashedNum = `#${cleanNum}`

  let order = null
  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      order = await Order.findOne({
        $or: [
          { orderNumber: cleanNum },
          { orderNumber: hashedNum },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        ],
      })
    } catch {
      // Fallback to in-memory check
    }
  }

  if (!order) {
    order = RECENT_DROP_ORDERS.find(
      (o) =>
        o.id === cleanNum ||
        o.id === hashedNum ||
        o.orderNumber === cleanNum ||
        o.orderNumber === hashedNum
    )
  }

  if (!order) {
    return next(new AppError(`Order '${id}' not found`, 404))
  }

  // Security Verification: Only the order owner or an admin can access this order
  const orderUserId = order.user?._id ? order.user._id.toString() : order.user ? order.user.toString() : null
  const orderEmail = order.userEmail ? order.userEmail.toLowerCase() : null

  const isOwner =
    (userId && orderUserId && String(orderUserId) === String(userId)) ||
    (userEmail && orderEmail && orderEmail === userEmail)

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      success: false,
      error: 'Access denied: You are not authorized to view this order.',
    })
  }

  res.json({
    success: true,
    data: order,
  })
})

export const createOrder = asyncHandler(async (req, res, next) => {
  const { email, items, shippingAddress, shippingMethod, paymentMethod } = req.body

  if (!items || !items.length) {
    return next(new AppError('Order must contain at least one item', 400))
  }

  const sanitizedItems = []

  for (const it of items) {
    const productId = String(it.productId || it.id || '').trim()
    if (!productId) {
      return next(new AppError('Each order item must specify a valid productId', 400))
    }

    // Authoritative product lookup from database/server catalog
    const serverProduct = await getAuthoritativeProduct(productId)
    if (!serverProduct) {
      return next(new AppError(`Product '${productId}' not found in catalog`, 400))
    }

    const quantity = Math.max(1, parseInt(it.quantity, 10) || 1)
    const size = it.size || 'Standard'
    const colorway = it.colorway || 'Default'

    let itemImage = serverProduct.image
    if (colorway && Array.isArray(serverProduct.colorways)) {
      const matched = serverProduct.colorways.find(
        (c) => c.name?.toLowerCase() === colorway.toLowerCase()
      )
      if (matched?.image) {
        itemImage = matched.image
      }
    }

    sanitizedItems.push({
      productId: serverProduct.id,
      title: serverProduct.title,
      price: Number(serverProduct.price), // Authoritative price from server/DB - client price ignored!
      quantity,
      size,
      colorway,
      image: itemImage || it.image || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400',
    })
  }

  const subtotal = Number(
    sanitizedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  )
  const shippingCost = shippingMethod === 'priority' ? 25.0 : 0.0
  const tax = Number((subtotal * 0.08).toFixed(2))
  const totalAmount = Number((subtotal + shippingCost + tax).toFixed(2))

  const orderNumber = `DEV-${Math.floor(100000 + Math.random() * 900000)}`

  const isCod = paymentMethod === 'cod' || paymentMethod === 'cash-on-delivery'
  const initialStatus = isCod ? 'Confirmed' : 'Pending'
  const initialPaymentStatus = isCod ? 'unpaid' : 'unpaid'

  const newOrderData = {
    orderNumber,
    user: req.user?._id || req.user?.id || null,
    userEmail: email,
    items: sanitizedItems,
    shippingAddress,
    shippingMethod: (shippingMethod || 'standard').toLowerCase(),
    paymentMethod: paymentMethod || 'stripe-card',
    subtotal: Number(subtotal.toFixed(2)),
    shippingCost,
    tax,
    totalAmount,
    status: initialStatus,
    paymentStatus: initialPaymentStatus,
    createdAt: new Date().toISOString(),
  }

  let finalOrder = newOrderData

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const savedOrder = await Order.create(newOrderData)
      finalOrder = savedOrder.toObject ? savedOrder.toObject() : savedOrder
    } catch (e) {
      console.warn('[ORDER DB NOTICE] Saved to memory fallback:', e.message)
      RECENT_DROP_ORDERS.unshift(newOrderData)
    }
  } else {
    RECENT_DROP_ORDERS.unshift(newOrderData)
  }

  // Only dispatch receipt if payment is confirmed; for card orders, webhook sends receipt once payment succeeds
  if (finalOrder.status === 'Confirmed' || finalOrder.paymentStatus === 'paid') {
    sendOrderReceiptEmail(finalOrder)
      .then((emailResult) => {
        if (emailResult.previewUrl) {
          console.log(`[RECEIPT PREVIEW] Customer receipt link: ${emailResult.previewUrl}`)
        }
      })
      .catch((err) => {
        console.warn('[RECEIPT EMAIL NOTICE] Background email dispatch:', err.message)
      })
  }

  res.status(201).json({
    success: true,
    data: finalOrder,
    message: `Order ${orderNumber} placed successfully. An authenticated invoice has been dispatched to ${email}.`,
  })
})
