import { Review } from '../models/Review.js'
import Product from '../models/Product.js'
import AppError from '../utils/AppError.js'
import { connectDB, getDBStatus } from '../config/db.js'

// In-memory fallback for offline or development resilience
const inMemoryReviews = [
  {
    id: 'rev_seed_1',
    productId: 'air-jordan-6-eastside',
    author: 'Marcus V.',
    rating: 5,
    title: 'Flawless execution & premium leather',
    content: 'Insane comfort and the build quality in person exceeds expectations. True to size with plenty of lock-down support. Box arrived with authentic NFC tag fully verified.',
    size: 'US 10.5',
    verified: true,
    createdAt: new Date('2026-10-22T10:00:00Z'),
  },
  {
    id: 'rev_seed_2',
    productId: 'air-jordan-6-eastside',
    author: 'Kenji T.',
    rating: 5,
    title: 'Top tier deadstock addition',
    content: 'Was fortunate to secure this on drop day. The silhouette stands out effortlessly with cargo or tapered pants. Fast shipping from the Vault.',
    size: 'US 9.0',
    verified: true,
    createdAt: new Date('2026-10-19T14:30:00Z'),
  },
]

/**
 * Get all reviews for a specific product along with summary statistics
 * GET /api/products/:productId/reviews
 */
export const getProductReviews = async (req, res, next) => {
  try {
    await connectDB()
    const { productId } = req.params
    if (!productId) {
      return next(new AppError('Product ID is required', 400))
    }

    let rawReviews = []
    const dbStatus = getDBStatus()

    if (dbStatus.connected) {
      try {
        rawReviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean()
      } catch (dbErr) {
        console.warn(`[REVIEWS] DB query failed, falling back to memory store: ${dbErr.message}`)
        rawReviews = inMemoryReviews.filter((r) => r.productId === productId)
      }
    } else {
      rawReviews = inMemoryReviews.filter((r) => r.productId === productId)
    }

    const total = rawReviews.length
    let sum = 0
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

    for (const rev of rawReviews) {
      const star = Math.min(5, Math.max(1, Math.round(rev.rating || 5)))
      distribution[star] = (distribution[star] || 0) + 1
      sum += Number(rev.rating || 0)
    }

    const averageRating = total > 0 ? Number((sum / total).toFixed(1)) : 5.0
    const percentages = {
      5: total > 0 ? Math.round((distribution[5] / total) * 100) : 100,
      4: total > 0 ? Math.round((distribution[4] / total) * 100) : 0,
      3: total > 0 ? Math.round((distribution[3] / total) * 100) : 0,
      2: total > 0 ? Math.round((distribution[2] / total) * 100) : 0,
      1: total > 0 ? Math.round((distribution[1] / total) * 100) : 0,
    }

    res.json({
      success: true,
      count: total,
      averageRating,
      distribution,
      percentages,
      data: rawReviews.map((r) => ({
        id: r._id || r.id,
        author: r.author,
        rating: r.rating,
        title: r.title,
        content: r.content,
        size: r.size,
        verified: r.verified !== false,
        date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        createdAt: r.createdAt,
      })),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Submit a new customer review for a product
 * POST /api/products/:productId/reviews
 */
export const createProductReview = async (req, res, next) => {
  try {
    await connectDB()
    const { productId } = req.params
    const { author, rating, title, content, size } = req.body

    if (!productId) {
      return next(new AppError('Product ID is required', 400))
    }

    if (!author || !author.trim()) {
      return next(new AppError('Please provide your name', 400))
    }

    if (!content || !content.trim()) {
      return next(new AppError('Please provide review details', 400))
    }

    const numRating = Number(rating)
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return next(new AppError('Rating must be a number between 1 and 5', 400))
    }

    const cleanProductId = String(productId).trim()
    const cleanAuthor = author.trim()
    const cleanTitle = (title || '').trim()
    const cleanContent = content.trim()
    const cleanSize = (size || '').trim()

    let savedReview = null
    const dbStatus = getDBStatus()

    if (dbStatus.connected) {
      try {
        const doc = await Review.create({
          productId: cleanProductId,
          author: cleanAuthor,
          rating: numRating,
          title: cleanTitle,
          content: cleanContent,
          size: cleanSize,
          verified: true,
        })
        savedReview = {
          id: doc._id,
          author: doc.author,
          rating: doc.rating,
          title: doc.title,
          content: doc.content,
          size: doc.size,
          verified: doc.verified,
          date: 'Just now',
          createdAt: doc.createdAt,
        }

        // Try updating Product rating and reviewsCount in DB
        try {
          const allProductReviews = await Review.find({ productId: cleanProductId })
          const count = allProductReviews.length
          const avg = Number((allProductReviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1))

          await Product.findOneAndUpdate(
            { $or: [{ id: cleanProductId }, { _id: cleanProductId }] },
            { rating: avg, reviewsCount: count }
          )
        } catch {
          // Non-critical
        }
      } catch (err) {
        console.warn(`[REVIEWS] DB create failed, saving to memory: ${err.message}`)
      }
    }

    if (!savedReview) {
      const memoryDoc = {
        id: `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        productId: cleanProductId,
        author: cleanAuthor,
        rating: numRating,
        title: cleanTitle,
        content: cleanContent,
        size: cleanSize,
        verified: true,
        date: 'Just now',
        createdAt: new Date(),
      }
      inMemoryReviews.unshift(memoryDoc)
      savedReview = memoryDoc
    }

    console.log(`[REVIEW SAVED] Product ${cleanProductId} review by ${cleanAuthor} (${numRating}★)`)

    res.status(201).json({
      success: true,
      message: 'Review published successfully! Thank you for your feedback.',
      data: savedReview,
    })
  } catch (error) {
    next(error)
  }
}
