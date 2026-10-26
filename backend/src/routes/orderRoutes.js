import express from 'express'
import {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
} from '../controllers/orderController.js'
import { validate } from '../middleware/validate.js'
import {
  createOrderSchema,
  orderIdParamSchema,
} from '../validators/orderValidator.js'
import {
  requireAuth,
  requireAdmin,
  optionalAuth,
} from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/orders - Restricted strictly to administrators
router.get('/', requireAdmin, getOrders)

// GET /api/orders/my-orders (and /me) - Authenticated users get only their own orders
router.get('/my-orders', requireAuth, getMyOrders)
router.get('/me', requireAuth, getMyOrders)

// POST /api/orders - Place order (associates user if token is present)
router.post('/', optionalAuth, validate(createOrderSchema), createOrder)

// GET /api/orders/:id - Authenticated users can only view their own order; Admins can view any order
router.get('/:id', requireAuth, validate(orderIdParamSchema), getOrderById)

export default router
