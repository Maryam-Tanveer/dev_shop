import User from '../models/User.js'
import Product from '../models/Product.js'
import { toLightProduct } from '../data/products/index.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

/**
 * GET /api/wishlist
 * Returns current user's wishlisted items and IDs from MongoDB
 */
export const getWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user.id || req.user._id
  const user = await User.findById(userId).lean()
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  const ids = user.wishlist || []
  const products = ids.length > 0 ? await Product.find({ id: { $in: ids } }).lean() : []
  const items = products.map(toLightProduct)

  res.json({
    success: true,
    count: items.length,
    ids,
    data: items,
  })
})

/**
 * POST /api/wishlist/toggle
 * Toggles a product in the user's wishlist in MongoDB
 */
export const toggleWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body
  if (!productId) {
    return next(new AppError('productId is required in request body', 400))
  }

  const userId = req.user.id || req.user._id
  const user = await User.findById(userId)
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  const currentList = user.wishlist || []
  const exists = currentList.includes(productId)
  let inWishlist = false

  if (exists) {
    user.wishlist = currentList.filter((id) => id !== productId)
    inWishlist = false
  } else {
    user.wishlist = [...currentList, productId]
    inWishlist = true
  }

  await user.save()

  const ids = user.wishlist
  const products = ids.length > 0 ? await Product.find({ id: { $in: ids } }).lean() : []
  const items = products.map(toLightProduct)

  res.json({
    success: true,
    inWishlist,
    count: items.length,
    ids,
    data: items,
    message: inWishlist ? 'Added to wishlist' : 'Removed from wishlist',
  })
})

/**
 * DELETE /api/wishlist/:productId
 * Removes a specific item from the user's wishlist in MongoDB
 */
export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params
  if (!productId) {
    return next(new AppError('productId is required', 400))
  }

  const userId = req.user.id || req.user._id
  const user = await User.findById(userId)
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  user.wishlist = (user.wishlist || []).filter((id) => id !== productId)
  await user.save()

  res.json({
    success: true,
    message: 'Removed from wishlist',
    ids: user.wishlist,
  })
})

/**
 * DELETE /api/wishlist
 * Clears the user's entire wishlist in MongoDB
 */
export const clearWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user.id || req.user._id
  const user = await User.findById(userId)
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  user.wishlist = []
  await user.save()

  res.json({
    success: true,
    message: 'Wishlist cleared',
    ids: [],
    data: [],
  })
})
