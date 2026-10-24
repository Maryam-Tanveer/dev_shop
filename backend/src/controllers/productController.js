import {
  LIGHT_PRODUCTS,
  getProductById as lookupProduct,
  toLightProduct,
  toDetailProduct,
  PRODUCTS_DATABASE,
  ALL_PRODUCTS,
} from '../data/products/index.js'
import {
  BEST_DEALS,
  RELATED_PRODUCTS,
  CROSS_SELL_ITEMS,
  WISHLIST_RECOMMENDATIONS
} from '../data/mockData.js'
import AppError from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import Product from '../models/Product.js'
import { getDBStatus } from '../config/db.js'

/**
 * Get all products (Lightweight shape) with optional filtering by category, brand, or search query
 */
export const getProducts = (req, res) => {
  const { category, brand, q } = req.query
  let results = [...LIGHT_PRODUCTS]

  if (category && category !== 'All') {
    results = results.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    )
  }

  if (brand && brand !== 'All') {
    results = results.filter(
      (p) => p.brand?.toLowerCase().includes(brand.toLowerCase())
    )
  }

  if (q && q.trim()) {
    const query = q.trim().toLowerCase()
    results = results.filter(
      (p) =>
        p.title?.toLowerCase().includes(query) ||
        p.fullTitle?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
    )
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  })
}

/**
 * Get single product by ID (Full Detail shape)
 */
export const getProductById = (req, res, next) => {
  const { id } = req.params
  const rawProduct = lookupProduct(id)

  if (!rawProduct) {
    return next(new AppError(`Product with id '${id}' not found`, 404))
  }

  const fullProduct = toDetailProduct(rawProduct)

  res.json({
    success: true,
    data: fullProduct
  })
}

/**
 * Get best deals (Lightweight shape)
 */
export const getDeals = (req, res) => {
  // Combine deals from rich catalog + BEST_DEALS normalized to unified light shape
  const dealsMap = new Map()

  // First add deals from the rich catalog
  LIGHT_PRODUCTS.filter((p) => p.isDeal).forEach((p) => dealsMap.set(p.id, p))

  // Merge any additional entries from BEST_DEALS normalized
  BEST_DEALS.forEach((deal) => {
    if (!dealsMap.has(deal.id)) {
      dealsMap.set(deal.id, toLightProduct(deal))
    }
  })

  const deals = Array.from(dealsMap.values())

  res.json({
    success: true,
    count: deals.length,
    data: deals
  })
}

/**
 * Get related products (Lightweight shape)
 */
export const getRelatedProducts = (req, res) => {
  const normalized = RELATED_PRODUCTS.map(toLightProduct)
  res.json({
    success: true,
    count: normalized.length,
    data: normalized
  })
}

/**
 * Get cart suggestions / cross-sells (Lightweight shape)
 */
export const getCartSuggestions = (req, res) => {
  const normalized = CROSS_SELL_ITEMS.map(toLightProduct)
  res.json({
    success: true,
    count: normalized.length,
    data: normalized
  })
}

/**
 * Get wishlist recommendations (Lightweight shape)
 */
export const getWishlistRecommendations = (req, res) => {
  const normalized = WISHLIST_RECOMMENDATIONS.map(toLightProduct)
  res.json({
    success: true,
    count: normalized.length,
    data: normalized
  })
}

/**
 * Create a new streetwear drop (Admin only)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    id: customId,
    title,
    fullTitle,
    brand,
    category = 'Sneakers',
    price,
    originalPrice,
    stockStatus = 'In Stock',
    stock = 15,
    badge = 'NEW DROP',
    badgeType = 'hot',
    badgeColor = 'bg-[#c81d25] text-white',
    image,
    description,
    sizes,
    colorways,
  } = req.body

  const generatedId = customId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString(36)}`

  const newRawItem = {
    id: generatedId,
    title,
    fullTitle: fullTitle || title,
    brand,
    category,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    stockStatus,
    stock: Number(stock),
    badge: badge || 'NEW DROP',
    badgeType: badgeType || 'hot',
    badgeColor: badgeColor || 'bg-[#c81d25] text-white',
    image,
    description: description || `${title} engineered by ${brand}. Limited edition archive release with guaranteed vault authentication.`,
    sizes: sizes && sizes.length > 0 ? sizes : [
      { size: '8.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '9.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '9.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '10.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '10.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '11.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
    ],
    colorways: colorways && colorways.length > 0 ? colorways : [
      { id: 'og', name: 'Original Colorway', color: '#171717' }
    ],
    isNew: true,
    isDeal: Boolean(originalPrice && originalPrice > price),
    tag: 'Vault Certified',
    rating: 5.0,
    reviews: 1,
    verified: true,
    dropCode: 'ADMIN DROP',
    edition: '2026 ARCHIVE'
  }

  const detailProduct = toDetailProduct(newRawItem)
  const lightProduct = toLightProduct(detailProduct)

  // In-memory cache sync for instant catalog updates
  PRODUCTS_DATABASE[generatedId] = detailProduct
  ALL_PRODUCTS.unshift(detailProduct)
  LIGHT_PRODUCTS.unshift(lightProduct)

  // MongoDB persistence if connected
  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      await Product.create({
        id: generatedId,
        title,
        fullTitle: fullTitle || title,
        brand,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        image,
        badge,
        inStock: stockStatus !== 'Sold Out',
        stockCount: Number(stock),
        description: newRawItem.description,
      })
    } catch (err) {
      console.warn('[DB CREATE PRODUCT NOTICE]:', err.message)
    }
  }

  res.status(201).json({
    success: true,
    message: `Drop '${title}' successfully deployed to Dev Shop Vault.`,
    data: detailProduct
  })
})

/**
 * Update drop status, stock, price, or details (Admin only)
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const updates = req.body

  const existing = PRODUCTS_DATABASE[id]
  if (!existing) {
    return next(new AppError(`Product with id '${id}' not found`, 404))
  }

  const updatedItem = {
    ...existing,
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : existing.price,
    originalPrice: updates.originalPrice !== undefined ? (updates.originalPrice ? Number(updates.originalPrice) : null) : existing.originalPrice,
    stock: updates.stock !== undefined ? Number(updates.stock) : existing.stock,
    stockStatus: updates.stockStatus || existing.stockStatus,
    isUnavailable: updates.stockStatus === 'Sold Out' || updates.stockStatus === 'TBA' || updates.isUnavailable,
  }

  const detailProduct = toDetailProduct(updatedItem)
  const lightProduct = toLightProduct(detailProduct)

  PRODUCTS_DATABASE[id] = detailProduct

  const allIdx = ALL_PRODUCTS.findIndex((p) => p.id === id)
  if (allIdx !== -1) ALL_PRODUCTS[allIdx] = detailProduct

  const lightIdx = LIGHT_PRODUCTS.findIndex((p) => p.id === id)
  if (lightIdx !== -1) LIGHT_PRODUCTS[lightIdx] = lightProduct

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      await Product.findOneAndUpdate(
        { id },
        {
          ...updates,
          inStock: updatedItem.stockStatus !== 'Sold Out',
          stockCount: updatedItem.stock
        },
        { new: true }
      )
    } catch (err) {
      console.warn('[DB UPDATE PRODUCT NOTICE]:', err.message)
    }
  }

  res.json({
    success: true,
    message: `Drop '${id}' status updated to ${updatedItem.stockStatus} (Stock: ${updatedItem.stock}).`,
    data: detailProduct
  })
})

/**
 * Delete / Archive drop from vault (Admin only)
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  if (!PRODUCTS_DATABASE[id]) {
    return next(new AppError(`Product with id '${id}' not found`, 404))
  }

  delete PRODUCTS_DATABASE[id]

  const allIdx = ALL_PRODUCTS.findIndex((p) => p.id === id)
  if (allIdx !== -1) ALL_PRODUCTS.splice(allIdx, 1)

  const lightIdx = LIGHT_PRODUCTS.findIndex((p) => p.id === id)
  if (lightIdx !== -1) LIGHT_PRODUCTS.splice(lightIdx, 1)

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      await Product.findOneAndDelete({ id })
    } catch (err) {
      console.warn('[DB DELETE PRODUCT NOTICE]:', err.message)
    }
  }

  res.json({
    success: true,
    message: `Drop '${id}' archived and removed from active vault.`
  })
})
