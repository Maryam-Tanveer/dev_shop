import express from 'express'
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getWishlist)
router.post('/toggle', toggleWishlist)
router.delete('/:productId', removeFromWishlist)
router.delete('/', clearWishlist)

export default router
