import Drop from '../models/Drop.js'
import { HERO_DROP, FESTIVAL_PASS } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { sendDropAlertEmail } from '../services/emailService.js'

export const getAllDrops = asyncHandler(async (req, res) => {
  const hero = (await Drop.findOne({ type: 'hero' }).lean()) || HERO_DROP
  const festivalPass = (await Drop.findOne({ type: 'festival-pass' }).lean()) || FESTIVAL_PASS
  res.json({
    success: true,
    data: {
      hero,
      festivalPass,
    },
  })
})

export const getHeroDrop = asyncHandler(async (req, res) => {
  const hero = (await Drop.findOne({ type: 'hero' }).lean()) || HERO_DROP
  res.json({
    success: true,
    data: hero,
  })
})

export const getFestivalPass = asyncHandler(async (req, res) => {
  const pass = (await Drop.findOne({ type: 'festival-pass' }).lean()) || FESTIVAL_PASS
  res.json({
    success: true,
    data: pass,
  })
})

/**
 * POST /api/drops/subscribe-alert
 * Dispatches a drop reservation alert email to the subscriber
 */
export const subscribeDropAlert = asyncHandler(async (req, res, next) => {
  const { email, dropTitle, releaseDate } = req.body

  if (!email || !email.trim()) {
    return next(new AppError('Please enter a valid email address for drop alerts', 400))
  }

  const result = await sendDropAlertEmail({
    email: email.trim(),
    dropTitle: dropTitle || 'Upcoming High-Heat Deadstock Drop',
    releaseDate: releaseDate || 'Friday at 10:00 AM EST',
    dropUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/products`,
  })

  res.json({
    success: true,
    message: `VIP Drop alert subscription confirmed! Notification dispatched to ${email}.`,
    previewUrl: result.previewUrl || null,
  })
})
