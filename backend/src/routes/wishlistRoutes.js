import express from 'express'
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js'

const router = express.Router()

router.get('/', getWishlist)
router.post('/toggle', toggleWishlist)
router.delete('/:productId', removeFromWishlist)
router.delete('/', clearWishlist)

export default router
