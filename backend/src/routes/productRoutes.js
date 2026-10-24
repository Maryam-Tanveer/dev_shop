import express from 'express'
import {
  getProducts,
  getProductById,
  getDeals,
  getRelatedProducts,
  getCartSuggestions,
  getWishlistRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { priceCart } from '../controllers/cartController.js'
import { validate } from '../middleware/validate.js'
import { requireAdmin } from '../middleware/authMiddleware.js'
import {
  productQuerySchema,
  productIdParamSchema,
  createProductSchema,
  updateProductSchema,
} from '../validators/productValidator.js'
import { priceCartSchema } from '../validators/cartValidator.js'

const router = express.Router()

// Public product endpoints
router.get('/', validate(productQuerySchema), getProducts)
router.get('/deals', getDeals)
router.get('/related', getRelatedProducts)
router.get('/cart-suggestions', getCartSuggestions)
router.get('/recommendations', getWishlistRecommendations)
router.post('/price-cart', validate(priceCartSchema), priceCart)
router.get('/:id', validate(productIdParamSchema), getProductById)

// Admin drop management endpoints
router.post('/', requireAdmin, validate(createProductSchema), createProduct)
router.patch('/:id', requireAdmin, validate(updateProductSchema), updateProduct)
router.delete('/:id', requireAdmin, validate(productIdParamSchema), deleteProduct)

export default router
