import express from 'express'
import { getProductReviews, createProductReview } from '../controllers/reviewController.js'

const router = express.Router({ mergeParams: true })

router.route('/')
  .get(getProductReviews)
  .post(createProductReview)

export default router
