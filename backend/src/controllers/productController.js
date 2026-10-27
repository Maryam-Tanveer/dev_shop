import {
  toLightProduct,
  toDetailProduct,
} from '../data/products/index.js'
import AppError from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import Product from '../models/Product.js'

/**
 * Get all products (Lightweight shape) with optional filtering by category, brand, or search query.
 * MongoDB is the single source of truth.
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { category, brand, q } = req.query
  const filter = {}

  if (category && category !== 'All') {
    filter.category = new RegExp(`^${category}$`, 'i')
  }
  if (brand && brand !== 'All') {
    filter.brand = new RegExp(brand, 'i')
  }
  if (q && q.trim()) {
    const queryRegex = new RegExp(q.trim(), 'i')
    filter.$or = [{ title: queryRegex }, { fullTitle: queryRegex }, { brand: queryRegex }]
  }

  const dbProducts = await Product.find(filter).lean()

  res.json({
    success: true,
    count: dbProducts.length,
    data: dbProducts.map(toLightProduct),
  })
})

/**
 * Get single product by ID (Full Detail shape) directly from MongoDB
 */
export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
  const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }
  const dbProduct = await Product.findOne(query).lean()

  if (!dbProduct) {
    return next(new AppError(`Product with id '${id}' not found`, 404))
  }

  res.json({
    success: true,
    data: toDetailProduct(dbProduct),
  })
})

/**
 * Get best deals (Lightweight shape) from MongoDB
 */
export const getDeals = asyncHandler(async (req, res) => {
  const deals = await Product.find({
    $or: [
      { originalPrice: { $gt: 0 } },
      { badge: /OFF|SALE|DEAL/i },
      { id: /^deal-/ },
    ],
  })
    .limit(8)
    .lean()

  const results = deals.length > 0 ? deals : await Product.find().limit(4).lean()

  res.json({
    success: true,
    count: results.length,
    data: results.map(toLightProduct),
  })
})

/**
 * Get related products (Lightweight shape) from MongoDB
 */
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { category, currentId } = req.query
  const filter = {}

  if (category && category !== 'All') {
    filter.category = new RegExp(category, 'i')
  }
  if (currentId) {
    filter.id = { $ne: currentId }
  }

  let products = await Product.find(filter).limit(4).lean()
  if (products.length === 0) {
    products = await Product.find().limit(4).lean()
  }

  res.json({
    success: true,
    count: products.length,
    data: products.map(toLightProduct),
  })
})

/**
 * Get cart suggestions / cross-sells (Lightweight shape) from MongoDB
 */
export const getCartSuggestions = asyncHandler(async (req, res) => {
  const suggestions = await Product.find({ inStock: true }).limit(4).lean()
  res.json({
    success: true,
    count: suggestions.length,
    data: suggestions.map(toLightProduct),
  })
})

/**
 * Get wishlist recommendations (Lightweight shape) from MongoDB
 */
export const getWishlistRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await Product.find({ inStock: true }).skip(2).limit(4).lean()
  res.json({
    success: true,
    count: recommendations.length,
    data: recommendations.map(toLightProduct),
  })
})

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

  const generatedId =
    customId ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
      `-${Date.now().toString(36)}`

  const newProduct = await Product.create({
    id: generatedId,
    title,
    fullTitle: fullTitle || title,
    brand,
    category,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    stockCount: Number(stock),
    inStock: stockStatus !== 'Sold Out',
    badge: badge || 'NEW DROP',
    image,
    description:
      description ||
      `${title} engineered by ${brand}. Limited edition archive release with guaranteed vault authentication.`,
    sizes:
      sizes && sizes.length > 0
        ? sizes.map((s) => (typeof s === 'string' ? s : s.size))
        : ['8.5', '9.0', '9.5', '10.0', '10.5', '11.0'],
    colors:
      colorways && colorways.length > 0
        ? colorways.map((c) => ({
            name: c.name || c.id || 'Colorway',
            hex: c.color || '#171717',
            image,
          }))
        : [{ name: 'OG', hex: '#171717', image }],
  })

  res.status(201).json({
    success: true,
    message: `Drop '${title}' successfully deployed to Dev Shop Vault.`,
    data: toDetailProduct(newProduct.toObject ? newProduct.toObject() : newProduct),
  })
})

/**
 * Update drop status, stock, price, or details (Admin only) directly in MongoDB
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const updates = req.body

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
  const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }

  const existing = await Product.findOne(query)
  if (!existing) {
    return next(new AppError(`Product with id '${id}' not found`, 404))
  }

  if (updates.stockStatus) {
    updates.inStock = updates.stockStatus !== 'Sold Out'
  }
  if (updates.stock !== undefined) {
    updates.stockCount = Number(updates.stock)
  }
  if (updates.price !== undefined) {
    updates.price = Number(updates.price)
  }
  if (updates.originalPrice !== undefined) {
    updates.originalPrice = updates.originalPrice ? Number(updates.originalPrice) : null
  }

  const updatedProduct = await Product.findOneAndUpdate(query, updates, { new: true }).lean()

  res.json({
    success: true,
    message: `Drop '${id}' status updated in database.`,
    data: toDetailProduct(updatedProduct),
  })
})

/**
 * Delete / Archive drop from vault (Admin only) directly in MongoDB
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
  const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }

  const deleted = await Product.findOneAndDelete(query).lean()
  if (!deleted) {
    return next(new AppError(`Product with id '${id}' not found`, 404))
  }

  res.json({
    success: true,
    message: `Drop '${id}' archived and removed from active vault.`,
  })
})
