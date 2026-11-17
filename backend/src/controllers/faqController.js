import Faq from '../models/Faq.js'
import SupportTicket from '../models/SupportTicket.js'
import { FAQ_CATEGORIES, FAQ_DATA } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { sendSupportTicketEmails } from '../services/emailService.js'

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

  const cleanEmail = email.trim().toLowerCase()
  const cleanName = (name || '').trim() || 'Valued Collector'
  const cleanTopic = (topic || '').trim() || 'General Inquiry'
  const cleanOrderNum = (orderNumber || '').trim() || null
  const cleanMsg = (message || '').trim()

  const ticketId = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`

  // 1. Save ticket in database
  try {
    await SupportTicket.create({
      ticketId,
      name: cleanName,
      email: cleanEmail,
      topic: cleanTopic,
      orderNumber: cleanOrderNum,
      message: cleanMsg,
      status: 'OPEN',
    })
  } catch (err) {
    console.warn('[SUPPORT TICKET DB FALLBACK]:', err.message)
  }

  // 2. Dispatch two emails:
  // Mail 1: To user confirming ticket is received & team is working on it
  // Mail 2: To admin notifying new customer issue submitted
  sendSupportTicketEmails({
    ticketId,
    name: cleanName,
    email: cleanEmail,
    topic: cleanTopic,
    orderNumber: cleanOrderNum,
    message: cleanMsg,
  }).catch((err) => {
    console.warn('[SUPPORT TICKET EMAIL NOTICE]:', err.message)
  })

  res.status(201).json({
    success: true,
    message: 'Your concierge inquiry has been received. Our support team will reply within 15 minutes.',
    data: {
      ticketId,
      name: cleanName,
      email: cleanEmail,
      topic: cleanTopic,
      orderNumber: cleanOrderNum,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      estimatedResponseTime: 'Under 15 minutes',
    },
  })
})
