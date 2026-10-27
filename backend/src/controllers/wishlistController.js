import { getAuthoritativeProduct } from './cartController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

// In-memory wishlist store keyed by userId or guestToken/default
const WISHLIST_STORE = new Map()

// Default guest wishlist key
const DEFAULT_GUEST_KEY = 'guest_default'

const getSessionKey = (req) => {
  if (req.user && req.user.id) {
    return `user_${req.user.id}`
  }
  const guestHeader = req.headers['x-guest-id']
  return guestHeader ? `guest_${guestHeader}` : DEFAULT_GUEST_KEY
}

const getSetForRequest = (req) => {
  const key = getSessionKey(req)
  if (!WISHLIST_STORE.has(key)) {
    WISHLIST_STORE.set(key, new Set())
  }
  return WISHLIST_STORE.get(key)
}

/**
 * Hydrate a product ID into full display product via MongoDB lookup
 */
const hydrateProduct = async (productId) => {
  const serverProd = await getAuthoritativeProduct(productId)
  if (serverProd) return serverProd

  return {
    id: productId,
    title: productId.replace(/-/g, ' ').toUpperCase(),
    price: 150.0,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    stockStatus: 'In Stock',
    inStock: true,
  }
}

/**
 * GET /api/wishlist
 * Returns current wishlisted items and IDs
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const set = getSetForRequest(req)
  const ids = Array.from(set)
  const items = await Promise.all(ids.map(hydrateProduct))

  res.json({
    success: true,
    count: items.length,
    ids,
    data: items,
  })
})

/**
 * POST /api/wishlist/toggle
 * Toggles an item in the wishlist
 */
export const toggleWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body

  if (!productId) {
    return next(new AppError('productId is required in request body', 400))
  }

  const set = getSetForRequest(req)
  let inWishlist = false

  if (set.has(productId)) {
    set.delete(productId)
    inWishlist = false
  } else {
    set.add(productId)
    inWishlist = true
  }

  const ids = Array.from(set)
  const items = await Promise.all(ids.map(hydrateProduct))

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
 * Removes a specific item from the wishlist
 */
export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params
  const set = getSetForRequest(req)

  set.delete(productId)

  const ids = Array.from(set)
  const items = await Promise.all(ids.map(hydrateProduct))

  res.json({
    success: true,
    count: items.length,
    ids,
    data: items,
    message: 'Item removed from wishlist',
  })
})

/**
 * DELETE /api/wishlist
 * Clears entire wishlist
 */
export const clearWishlist = asyncHandler(async (req, res) => {
  const set = getSetForRequest(req)
  set.clear()

  res.json({
    success: true,
    count: 0,
    ids: [],
    data: [],
    message: 'Wishlist cleared',
  })
})
