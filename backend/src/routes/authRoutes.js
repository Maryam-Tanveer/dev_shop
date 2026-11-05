import express from 'express'
import { login, register, getMe, googleAuth, logout } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { authLimiter } from '../middleware/security.js'
import {
  loginSchema,
  registerSchema,
  googleAuthSchema,
} from '../validators/authValidator.js'

const router = express.Router()

// Apply rate limiting specifically to credential and token submission endpoints
router.post('/login', authLimiter, validate(loginSchema), login)
router.post('/register', authLimiter, validate(registerSchema), register)
router.post('/signup', authLimiter, validate(registerSchema), register)
router.post('/google', authLimiter, validate(googleAuthSchema), googleAuth)
router.post('/logout', logout)
router.get('/me', getMe)

export default router
