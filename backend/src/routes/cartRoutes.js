import express from 'express'
import { priceCart } from '../controllers/cartController.js'
import { validate } from '../middleware/validate.js'
import { priceCartSchema } from '../validators/cartValidator.js'

const router = express.Router()

// Endpoint to price and hydrate cart line items
router.post('/price', validate(priceCartSchema), priceCart)
router.post('/sync', validate(priceCartSchema), priceCart)

export default router
