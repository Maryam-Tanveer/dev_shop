import rateLimit from 'express-rate-limit'

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000
const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 200
const authMaxRequests = Number(process.env.AUTH_RATE_LIMIT_MAX) || 30

/**
 * General API Rate Limiter
 */
export const apiLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
})

/**
 * Strict Rate Limiter for Authentication endpoints to prevent brute-force attacks
 */
export const authLimiter = rateLimit({
  windowMs,
  max: authMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login or registration attempts. Please try again after 15 minutes.',
  },
})
