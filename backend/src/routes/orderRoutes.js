import express from 'express'
import {
  getOrders,
  getOrderById,
  createOrder,
} from '../controllers/orderController.js'
import { validate } from '../middleware/validate.js'
import {
  createOrderSchema,
  orderIdParamSchema,
} from '../validators/orderValidator.js'

const router = express.Router()

router.get('/', getOrders)
router.post('/', validate(createOrderSchema), createOrder)
router.get('/:id', validate(orderIdParamSchema), getOrderById)

export default router
