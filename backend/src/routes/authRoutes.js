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

// Apply strict rate limiting to all auth endpoints
router.use(authLimiter)

router.post('/login', validate(loginSchema), login)
router.post('/register', validate(registerSchema), register)
router.post('/signup', validate(registerSchema), register)
router.post('/google', validate(googleAuthSchema), googleAuth)
router.post('/logout', logout)
router.get('/me', requireAuth, getMe)

export default router
