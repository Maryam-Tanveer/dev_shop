import express from 'express'
import {
  createCheckoutSession,
  stripeWebhook,
  verifySession,
} from '../controllers/paymentController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /api/payments/create-checkout-session (PCI-compliant hosted checkout)
router.post('/create-checkout-session', optionalAuth, createCheckoutSession)

// POST /api/payments/webhook (Stripe webhook endpoint)
router.post('/webhook', stripeWebhook)

// GET /api/payments/verify-session/:sessionId (Verify session payment completion)
router.get('/verify-session/:sessionId', verifySession)

export default router
