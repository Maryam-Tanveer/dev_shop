import { RECENT_DROP_ORDERS } from '../data/mockData.js'
import Order from '../models/Order.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { getDBStatus } from '../config/db.js'
import { sendOrderReceiptEmail } from '../services/emailService.js'
import { getAuthoritativeProduct } from './cartController.js'

export const getOrders = asyncHandler(async (req, res) => {
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

export const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const order = await Order.findOne({
        $or: [{ orderNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      })
      if (order) {
        return res.json({
          success: true,
          data: order,
        })
      }
    } catch {
      // Fallback to in-memory check
    }
  }

  const order = RECENT_DROP_ORDERS.find((o) => o.id === id || o.orderNumber === id)

  if (!order) {
    return next(new AppError(`Order '${id}' not found`, 404))
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

  const newOrderData = {
    orderNumber,
    user: req.user?._id || req.user?.id || null,
    userEmail: email,
    items: sanitizedItems,
    shippingAddress,
    shippingMethod: (shippingMethod || 'standard').toLowerCase(),
    paymentMethod: paymentMethod || 'credit-card',
    subtotal: Number(subtotal.toFixed(2)),
    shippingCost,
    tax,
    totalAmount,
    status: 'Confirmed',
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

  // Trigger Nodemailer receipt dispatch asynchronously (non-blocking)
  sendOrderReceiptEmail(finalOrder)
    .then((emailResult) => {
      if (emailResult.previewUrl) {
        console.log(`[RECEIPT PREVIEW] Customer receipt link: ${emailResult.previewUrl}`)
      }
    })
    .catch((err) => {
      console.warn('[RECEIPT EMAIL NOTICE] Background email dispatch:', err.message)
    })

  res.status(201).json({
    success: true,
    data: finalOrder,
    message: `Order ${orderNumber} placed successfully. An authenticated invoice has been dispatched to ${email}.`,
  })
})
