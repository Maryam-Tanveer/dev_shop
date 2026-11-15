import Faq from '../models/Faq.js'
import { FAQ_CATEGORIES, FAQ_DATA } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/AppError.js'

export const getFaqs = asyncHandler(async (req, res) => {
  const { category } = req.query
  const query = category && category !== 'all' ? { category } : {}
  let data = []

  try {
    data = await Faq.find(query).sort({ createdAt: 1 }).lean()
  } catch (err) {
    console.warn('[FAQ DB WARNING]:', err.message)
  }

  // Fallback to rich FAQ_DATA if DB collection has not been seeded yet
  if (!data || data.length === 0) {
    data = category && category !== 'all'
      ? FAQ_DATA.filter((item) => item.category === category)
      : FAQ_DATA
  }

  res.json({
    success: true,
    count: data.length,
    data,
    categories: FAQ_CATEGORIES,
  })
})

export const getFaqCategories = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    count: FAQ_CATEGORIES.length,
    data: FAQ_CATEGORIES,
  })
})

/**
 * Submit Concierge Support Ticket
 * POST /api/faqs/contact
 */
export const submitSupportTicket = asyncHandler(async (req, res, next) => {
  const { name, email, topic, orderNumber, message } = req.body

  if (!email || !message) {
    return next(new AppError('Please provide both your email address and message.', 400))
  }

  const ticketId = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`

  res.status(201).json({
    success: true,
    message: 'Your concierge inquiry has been received. Our support team will reply within 15 minutes.',
    data: {
      ticketId,
      name: name || 'Valued Collector',
      email,
      topic: topic || 'General Inquiry',
      orderNumber: orderNumber || null,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      estimatedResponseTime: 'Under 15 minutes',
    },
  })
})
