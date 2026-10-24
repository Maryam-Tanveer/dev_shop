import { HERO_DROP, FESTIVAL_PASS } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { sendDropAlertEmail } from '../services/emailService.js'

export const getAllDrops = (req, res) => {
  res.json({
    success: true,
    data: {
      hero: HERO_DROP,
      festivalPass: FESTIVAL_PASS,
    },
  })
}

export const getHeroDrop = (req, res) => {
  res.json({
    success: true,
    data: HERO_DROP,
  })
}

export const getFestivalPass = (req, res) => {
  res.json({
    success: true,
    data: FESTIVAL_PASS,
  })
}

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
