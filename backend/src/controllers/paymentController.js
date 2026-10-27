import crypto from 'crypto'
import Stripe from 'stripe'
import Order from '../models/Order.js'
import { getAuthoritativeProduct } from './cartController.js'
import { getDBStatus } from '../config/db.js'
import { sendOrderReceiptEmail } from '../services/emailService.js'
import { RECENT_DROP_ORDERS } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

const getStripe = () => {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new AppError('Stripe is not configured. Missing STRIPE_SECRET_KEY in environment variables.', 500)
  }
  return new Stripe(secret)
}

/**
 * POST /api/payments/create-checkout-session
 * Creates server-authoritative Stripe Checkout Session and initial Pending order (PCI compliant)
 */
export const createCheckoutSession = asyncHandler(async (req, res, next) => {
  const { email, items, shippingAddress, shippingMethod } = req.body

  if (!items || !items.length) {
    return next(new AppError('No items provided in checkout payload', 400))
  }

  if (!email) {
    return next(new AppError('Customer email is required for checkout', 400))
  }

  // 1. Authoritative Server Product & Price Lookup
  const sanitizedItems = []
  for (const it of items) {
    const productId = String(it.productId || it.id || '').trim()
    const serverProduct = await getAuthoritativeProduct(productId)
    if (!serverProduct) {
      return next(new AppError(`Product '${productId}' not found in catalog`, 400))
    }

    const quantity = Math.max(1, parseInt(it.quantity, 10) || 1)
    const size = it.size || 'Standard'
    const colorway = it.colorway || 'Default'

    sanitizedItems.push({
      productId: serverProduct.id,
      title: serverProduct.title,
      price: Number(serverProduct.price),
      quantity,
      size,
      colorway,
      image: serverProduct.image || '',
    })
  }

  const subtotal = Number(
    sanitizedItems.reduce((acc, it) => acc + it.price * it.quantity, 0).toFixed(2)
  )
  const shippingCost = shippingMethod === 'priority' ? 25.0 : 0.0
  const tax = Number((subtotal * 0.08).toFixed(2))
  const totalAmount = Number((subtotal + shippingCost + tax).toFixed(2))
  const orderNumber = `DEV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`

  // 2. Create Order with PENDING status (Order is NOT confirmed until payment succeeds)
  const newOrderData = {
    orderNumber,
    user: req.user?._id || req.user?.id || null,
    userEmail: email,
    items: sanitizedItems,
    shippingAddress,
    shippingMethod: (shippingMethod || 'standard').toLowerCase(),
    paymentMethod: 'stripe-card',
    subtotal,
    shippingCost,
    tax,
    totalAmount,
    status: 'Pending',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString(),
  }

  let savedOrder = newOrderData
  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const created = await Order.create(newOrderData)
      savedOrder = created.toObject ? created.toObject() : created
    } catch (e) {
      if (process.env.NODE_ENV === 'production') {
        return next(new AppError('Failed to record order to persistent database.', 500))
      }
      console.warn('[Stripe Checkout Order Notice]:', e.message)
      RECENT_DROP_ORDERS.unshift(newOrderData)
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      return next(
        new AppError('Database connection unavailable. Cannot initiate checkout in production without persistent database.', 503)
      )
    }
    RECENT_DROP_ORDERS.unshift(newOrderData)
  }

  // 3. Initialize Stripe Checkout Session
  const stripe = getStripe()
  const frontendUrl = (process.env.FRONTEND_URL || 'https://dev-shop-bay.vercel.app').replace(/\/+$/, '')

  const lineItems = sanitizedItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
        images: item.image && item.image.startsWith('http') ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100), // in cents
    },
    quantity: item.quantity,
  }))

  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Priority Insured Shipping' },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    })
  }

  if (tax > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Estimated Sales Tax (8%)' },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: lineItems,
    metadata: {
      orderNumber,
      orderId: String(savedOrder._id || orderNumber),
    },
    success_url: `${frontendUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}&order_number=${orderNumber}`,
    cancel_url: `${frontendUrl}/checkout?canceled=true`,
  })

  // Save stripeSessionId to order
  if (dbStatus.connected && savedOrder._id) {
    await Order.findByIdAndUpdate(savedOrder._id, { stripeSessionId: session.id }).catch(() => {})
  }
  savedOrder.stripeSessionId = session.id

  res.status(200).json({
    success: true,
    url: session.url,
    sessionId: session.id,
    orderNumber,
  })
})

/**
 * POST /api/payments/webhook
 * Stripe Webhook: listens for checkout.session.completed to mark order Confirmed & Paid
 * Strictly requires cryptographic stripe-signature and STRIPE_WEBHOOK_SECRET (No unsigned fallback)
 * Authoritatively validates paid amount against order totalAmount before confirming
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  // 1. Strict Secret & Signature Check — Zero Fallback
  if (!webhookSecret) {
    console.error('[STRIPE WEBHOOK ERROR]: STRIPE_WEBHOOK_SECRET is not configured on server.')
    return res.status(500).json({
      error: 'Webhook signing secret is not configured on server.',
    })
  }

  if (!sig) {
    console.warn('[STRIPE WEBHOOK REJECTED]: Missing stripe-signature header. Unsigned requests are rejected.')
    return res.status(400).json({
      error: 'Missing stripe-signature header. Unsigned webhook requests are strictly rejected.',
    })
  }

  let event

  // 2. Cryptographic Signature Verification
  try {
    const payload = req.rawBody || req.body
    event = Stripe.webhooks.constructEvent(payload, sig, webhookSecret)
  } catch (err) {
    console.error('[STRIPE WEBHOOK VERIFICATION FAILED]:', err.message)
    return res.status(400).json({
      error: `Webhook signature verification failed: ${err.message}`,
    })
  }

  // 3. Process Verified Events
  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object || {}
    const orderNumber = session.metadata?.orderNumber
    const sessionId = session.id
    const paymentIntentId = session.payment_intent || session.id

    // Confirm that payment status is actually paid
    if (session.payment_status !== 'paid') {
      console.warn(`[STRIPE WEBHOOK] Session ${sessionId} status is not paid (${session.payment_status}). Skipping.`)
      return res.status(200).json({ received: true, message: 'Session payment status not paid' })
    }

    const dbStatus = getDBStatus()
    let order = null

    if (dbStatus.connected) {
      try {
        order = await Order.findOne({
          $or: [
            ...(orderNumber ? [{ orderNumber }] : []),
            ...(sessionId ? [{ stripeSessionId: sessionId }] : []),
          ],
        })
      } catch (err) {
        console.error('[STRIPE WEBHOOK DB ERROR]:', err.message)
      }
    }

    if (!order) {
      order = RECENT_DROP_ORDERS.find(
        (o) => o.orderNumber === orderNumber || o.stripeSessionId === sessionId
      )
    }

    if (!order) {
      console.warn(`[STRIPE WEBHOOK] Order not found for orderNumber: ${orderNumber}, sessionId: ${sessionId}`)
      return res.status(404).json({ error: 'Order not found for verified checkout session.' })
    }

    // 4. Validate Amount: session.amount_total (cents) must match order.totalAmount (dollars)
    const paidAmount = Number((session.amount_total / 100).toFixed(2))
    const expectedAmount = Number(Number(order.totalAmount).toFixed(2))

    if (Math.abs(paidAmount - expectedAmount) > 0.05) {
      console.error(
        `[STRIPE WEBHOOK FRAUD DETECTED] Amount mismatch for order ${order.orderNumber}! Expected: $${expectedAmount}, Received: $${paidAmount}`
      )
      return res.status(400).json({
        error: `Payment amount mismatch: Expected $${expectedAmount}, received $${paidAmount}. Order confirmation aborted.`,
      })
    }

    // 5. Update Order to Confirmed and Paid
    order.status = 'Confirmed'
    order.paymentStatus = 'paid'
    order.stripePaymentIntentId = paymentIntentId
    if (dbStatus.connected && order.save) {
      await order.save()
    }

    console.log(`[STRIPE WEBHOOK] Verified signature & confirmed order ${order.orderNumber} for $${paidAmount}`)

    // Dispatch receipt email
    sendOrderReceiptEmail(order).catch((err) =>
      console.warn('[RECEIPT EMAIL NOTICE]:', err.message)
    )
  }

  return res.json({ received: true })
}

/**
 * GET /api/payments/verify-session/:sessionId
 * Verifies session payment status with Stripe and confirms order
 * Also validates session amount matches order totalAmount
 */
export const verifySession = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.params
  if (!sessionId) {
    return next(new AppError('Stripe Session ID is required', 400))
  }

  const stripe = getStripe()
  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err) {
    return next(new AppError(`Unable to retrieve Stripe session: ${err.message}`, 400))
  }

  if (session.payment_status !== 'paid') {
    return res.json({
      success: false,
      paid: false,
      status: session.payment_status,
      message: 'Payment has not been completed.',
    })
  }

  const orderNumber = session.metadata?.orderNumber
  const dbStatus = getDBStatus()
  let order = null

  if (dbStatus.connected) {
    try {
      order = await Order.findOne({
        $or: [
          ...(orderNumber ? [{ orderNumber }] : []),
          { stripeSessionId: sessionId },
        ],
      })
    } catch (err) {
      console.warn('[Verify Session DB update notice]:', err.message)
    }
  }

  if (!order) {
    order = RECENT_DROP_ORDERS.find(
      (o) => o.orderNumber === orderNumber || o.stripeSessionId === sessionId
    )
  }

  if (!order) {
    return next(new AppError('Order not found for verified session', 404))
  }

  // Validate amount: session amount must match order totalAmount
  const paidAmount = Number((session.amount_total / 100).toFixed(2))
  const expectedAmount = Number(Number(order.totalAmount).toFixed(2))

  if (Math.abs(paidAmount - expectedAmount) > 0.05) {
    return next(
      new AppError(
        `Payment amount mismatch: Expected $${expectedAmount}, received $${paidAmount}. Order will not be confirmed.`,
        400
      )
    )
  }

  order.status = 'Confirmed'
  order.paymentStatus = 'paid'
  order.stripePaymentIntentId = session.payment_intent
  if (dbStatus.connected && order.save) {
    await order.save()
  }

  sendOrderReceiptEmail(order).catch(() => {})

  res.json({
    success: true,
    paid: true,
    orderNumber: order.orderNumber || orderNumber,
    order,
  })
})
