import express from 'express'
import { priceCart, getCart, syncCart, clearUserCart } from '../controllers/cartController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { priceCartSchema, syncCartSchema } from '../validators/cartValidator.js'

const router = express.Router()

// Fetch user's persisted cart from database
router.get('/', optionalAuth, getCart)

// Endpoint to price and hydrate cart line items
router.post('/price', validate(priceCartSchema), priceCart)

// Synchronize cart items with MongoDB for logged in users
router.post('/sync', optionalAuth, validate(syncCartSchema), syncCart)

// Clear user's cart from MongoDB
router.delete('/', optionalAuth, clearUserCart)

export default router
