import Subscriber from '../models/Subscriber.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { connectDB } from '../config/db.js'
import { sendNewsletterWelcomeEmail, sendNewsletterBroadcastEmail } from '../services/emailService.js'

/**
 * POST /api/newsletter/subscribe
 * Subscribe an email address to the newsletter
 */
export const subscribeNewsletter = asyncHandler(async (req, res, next) => {
  const { email, source } = req.body

  if (!email || !email.trim()) {
    return next(new AppError('Please enter a valid email address.', 400))
  }

  const normalizedEmail = email.trim().toLowerCase()
  const emailRegex = /^\S+@\S+\.\S+$/
  if (!emailRegex.test(normalizedEmail)) {
    return next(new AppError('Please enter a valid email address.', 400))
  }

  await connectDB()

  try {
    const existing = await Subscriber.findOne({ email: normalizedEmail })

    if (existing) {
      if (existing.status === 'active') {
        return res.json({
          success: true,
          alreadySubscribed: true,
          message: 'You are already subscribed to our newsletter!',
        })
      }
      // Reactivate if unsubscribed
      existing.status = 'active'
      await existing.save()
    } else {
      await Subscriber.create({
        email: normalizedEmail,
        source: source || 'footer_newsletter',
        status: 'active',
      })
    }

    // Trigger confirmation email in the background without blocking response
    sendNewsletterWelcomeEmail({ email: normalizedEmail }).catch((err) => {
      console.warn('[NEWSLETTER EMAIL NOTICE]:', err.message)
    })

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! You are now on the list.',
    })
  } catch (err) {
    if (err.code === 11000) {
      return res.json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already subscribed to our newsletter!',
      })
    }
    return next(new AppError(err.message || 'Failed to subscribe to newsletter', 500))
  }
})

/**
 * GET /api/newsletter/subscribers (Admin count or list)
 */
export const getSubscriberCount = asyncHandler(async (req, res) => {
  await connectDB()
  const count = await Subscriber.countDocuments({ status: 'active' })
  res.json({
    success: true,
    count,
  })
})

/**
 * POST /api/newsletter/broadcast
 * Broadcast a sale or discount promo to all active newsletter subscribers
 */
export const broadcastNewsletter = asyncHandler(async (req, res) => {
  const { subject, title, discountPercent, promoCode, description, ctaUrl } = req.body

  await connectDB()
  const subscribers = await Subscriber.find({ status: 'active' }).select('email')

  if (!subscribers.length) {
    return res.json({
      success: true,
      message: 'No active subscribers found in database.',
      count: 0,
    })
  }

  const result = await sendNewsletterBroadcastEmail({
    subscribers,
    subject,
    title,
    discountPercent,
    promoCode,
    description,
    ctaUrl,
  })

  res.json({
    success: true,
    message: `Discount campaign successfully dispatched to ${result.sent} subscriber(s)!`,
    data: result,
  })
})
