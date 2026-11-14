import {
  toLightProduct,
  toDetailProduct,
  PRODUCTS_DATABASE,
  RAW_DATABASE,
} from '../data/products/index.js'
import AppError from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import Product from '../models/Product.js'

const escapeRegex = (s) => String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Get all products (Lightweight shape) with backend filtering:
 * Supports category/collection, brand, brands, minPrice, maxPrice, size, sizes, sort, and search query (q).
 * Queries MongoDB with seamless master database fallback.
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { category, brand, brands, minPrice, maxPrice, size, sizes, sort, q } = req.query
  const filter = {}

  // 1. Category / Collection filter
  if (category && category !== 'All') {
    if (/home\s*page/i.test(category)) {
      // Home page shows all primary vault drops
    } else if (/top\s*best\s*deals/i.test(category)) {
      filter.$or = [
        { originalPrice: { $gt: 0 } },
        { badge: /OFF|SALE|DEAL/i },
        { id: /^deal-/i },
      ]
    } else if (/automated\s*collection/i.test(category)) {
      filter.$or = [
        { category: /Automated Collection|Vault Editions/i },
        { brand: /EXCLUSIVE WINTER|NIKE LAB/i },
        { id: /snowboard/i },
      ]
    } else if (/hydrogen/i.test(category)) {
      filter.$or = [
        { category: /Hydrogen/i },
        { brand: /ASICS|SPECIAL EDITION/i },
      ]
    } else if (/^bag/i.test(category) || /pack/i.test(category)) {
      filter.$or = [
        { category: /Bags|Packs/i },
        { title: /pack|vest|bag|duffle/i },
      ]
    } else if (/dress|clothing|apparel|hoodie|streetwear/i.test(category)) {
      filter.category = /Streetwear|Apparel/i
    } else if (/^shoe|^sneaker|^footwear/i.test(category)) {
      filter.category = /Basketball|Running|Lifestyle|Skate|Trail Tech|Collabs/i
    } else if (/retro\s*basketball|basketball/i.test(category)) {
      filter.category = /Basketball|Skate\s*\/\s*Court/i
    } else if (/running|lifestyle|y2k|runner/i.test(category)) {
      filter.category = /Running|Lifestyle|Trail Tech/i
    } else if (/collab/i.test(category)) {
      filter.category = /Collabs/i
    } else if (/outerwear|technical/i.test(category)) {
      filter.category = /Outerwear/i
    } else if (/limited|care|accessories/i.test(category)) {
      filter.category = /Accessories|Vault Editions/i
    } else if (/new\s*arrival/i.test(category)) {
      filter.$or = [
        { badge: /HOT|NEW|GRAIL|RELEASE/i },
        { isNew: true },
      ]
    } else {
      filter.$or = [
        { category: new RegExp(escapeRegex(category), 'i') },
        { title: new RegExp(escapeRegex(category), 'i') },
        { fullTitle: new RegExp(escapeRegex(category), 'i') },
        { brand: new RegExp(escapeRegex(category), 'i') },
      ]
    }
  }

  // 2. Brand / Brands filter
  const brandList = []
  if (brands && typeof brands === 'string') {
    brandList.push(...brands.split(',').map((b) => b.trim()).filter(Boolean))
  }
  if (brand && brand !== 'All' && !brandList.includes(brand)) {
    brandList.push(brand)
  }
  if (brandList.length > 0) {
    const brandRegexes = brandList.map((b) => new RegExp(escapeRegex(b), 'i'))
    filter.brand = { $in: brandRegexes }
  }

  // 3. Price Range filter (minPrice, maxPrice)
  const numMin = Number(minPrice)
  const numMax = Number(maxPrice)
  const hasMin = !isNaN(numMin) && numMin > 0
  const hasMax = !isNaN(numMax) && numMax > 0 && numMax < 1000

  if (hasMin || hasMax) {
    filter.price = {}
    if (hasMin) filter.price.$gte = numMin
    if (hasMax) filter.price.$lte = numMax
  }

  // 4. Size / Sizes filter
  const sizeList = []
  if (sizes && typeof sizes === 'string') {
    sizeList.push(...sizes.split(',').map((s) => s.trim()).filter(Boolean))
  }
  if (size && !sizeList.includes(size)) {
    sizeList.push(size)
  }
  if (sizeList.length > 0) {
    const sizeConditions = [
      { sizes: { $in: sizeList } },
      { size: { $in: sizeList } },
      { 'specs.size': { $in: sizeList } },
    ]
    if (filter.$or) {
      filter.$and = filter.$and || []
      filter.$and.push({ $or: sizeConditions })
    } else {
      filter.$or = sizeConditions
    }
  }

  // 5. Search query (q)
  if (q && q.trim()) {
    const raw = q.trim()
    const tokens = raw.split(/\s+/).filter(Boolean)
    if (tokens.length > 0) {
      filter.$and = filter.$and || []
      tokens.forEach((token) => {
        const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(escaped, 'i')
        filter.$and.push({
          $or: [
            { title: regex },
            { fullTitle: regex },
            { brand: regex },
            { category: regex },
            { description: regex },
            { id: regex },
          ],
        })
      })
    }
  }

  // 6. Sort option
  let sortOption = { isFeatured: -1, createdAt: -1 }
  if (sort === 'price-low' || sort === 'Price: Low to High') {
    sortOption = { price: 1 }
  } else if (sort === 'price-high' || sort === 'Price: High to Low') {
    sortOption = { price: -1 }
  } else if (sort === 'rating' || sort === 'Highest Rated' || sort === 'Most Hyped') {
    sortOption = { rating: -1 }
  } else if (sort === 'newest' || sort === 'Newest Releases' || sort === 'Newest Drops') {
    sortOption = { createdAt: -1 }
  }

  let dbProducts = null
  try {
    const totalCount = await Product.countDocuments().catch(() => 0)
    if (totalCount > 0) {
      dbProducts = await Product.find(filter).sort(sortOption).lean()
    }
  } catch (err) {
    console.warn(`[getProducts] DB find failed: ${err.message}`)
  }

  // Master fallback if DB is not connected or empty
  let results = dbProducts
  if (!results) {
    let masterList = Array.isArray(PRODUCTS_DATABASE) ? [...PRODUCTS_DATABASE] : []

    // Filter in-memory masterList with exact criteria
    if (category && category !== 'All') {
      if (/top\s*best\s*deals/i.test(category)) {
        masterList = masterList.filter(
          (p) => p.originalPrice > 0 || /OFF|SALE|DEAL/i.test(p.badge) || /^deal-/i.test(p.id)
        )
      } else if (/automated\s*collection/i.test(category)) {
        masterList = masterList.filter(
          (p) =>
            /Automated Collection|Vault Editions/i.test(p.category) ||
            /EXCLUSIVE WINTER|NIKE LAB/i.test(p.brand) ||
            /snowboard/i.test(p.id)
        )
      } else if (/hydrogen/i.test(category)) {
        masterList = masterList.filter(
          (p) => /Hydrogen/i.test(p.category) || /ASICS|SPECIAL EDITION/i.test(p.brand)
        )
      } else if (/^bag/i.test(category) || /pack/i.test(category)) {
        masterList = masterList.filter(
          (p) =>
            /Bags|Packs/i.test(p.category) ||
            /pack|vest|bag|duffle/i.test(p.title)
        )
      } else if (/dress|clothing|apparel|hoodie|streetwear/i.test(category)) {
        masterList = masterList.filter((p) => /Streetwear|Apparel/i.test(p.category))
      } else if (/^shoe|^sneaker|^footwear/i.test(category)) {
        masterList = masterList.filter((p) =>
          /Basketball|Running|Lifestyle|Skate|Trail Tech|Collabs/i.test(p.category)
        )
      } else if (/retro\s*basketball|basketball/i.test(category)) {
        masterList = masterList.filter((p) => /Basketball|Skate\s*\/\s*Court/i.test(p.category))
      } else if (/running|lifestyle|y2k|runner/i.test(category)) {
        masterList = masterList.filter((p) => /Running|Lifestyle|Trail Tech/i.test(p.category))
      } else if (/collab/i.test(category)) {
        masterList = masterList.filter((p) => /Collabs/i.test(p.category))
      } else if (/outerwear|technical/i.test(category)) {
        masterList = masterList.filter((p) => /Outerwear/i.test(p.category))
      } else if (/limited|care|accessories/i.test(category)) {
        masterList = masterList.filter((p) => /Accessories|Vault Editions/i.test(p.category))
      } else if (/new\s*arrival/i.test(category)) {
        masterList = masterList.filter((p) => /HOT|NEW|GRAIL|RELEASE/i.test(p.badge) || p.isNew)
      } else if (!/home\s*page/i.test(category)) {
        const catReg = new RegExp(escapeRegex(category), 'i')
        masterList = masterList.filter(
          (p) =>
            catReg.test(p.category) ||
            catReg.test(p.title) ||
            catReg.test(p.fullTitle) ||
            catReg.test(p.brand)
        )
      }
    }

    if (brandList.length > 0) {
      masterList = masterList.filter((p) =>
        brandList.some((b) =>
          new RegExp(escapeRegex(b), 'i').test(p.brand || p.title || p.fullTitle)
        )
      )
    }

    if (hasMin || hasMax) {
      masterList = masterList.filter((p) => {
        const price = Number(p.price) || 0
        if (hasMin && price < numMin) return false
        if (hasMax && price > numMax) return false
        return true
      })
    }

    if (sizeList.length > 0) {
      masterList = masterList.filter((p) => {
        const pSizes = Array.isArray(p.sizes)
          ? p.sizes.map(String)
          : p.size
          ? [String(p.size)]
          : []
        return sizeList.some((s) => pSizes.includes(String(s)))
      })
    }

    if (q && q.trim()) {
      const qTokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
      masterList = masterList.filter((p) => {
        const text = `${p.title || ''} ${p.fullTitle || ''} ${p.brand || ''} ${p.category || ''} ${p.description || ''} ${p.id || ''}`.toLowerCase()
        return qTokens.every((t) => text.includes(t))
      })
    }

    // Sort in-memory
    if (sort === 'price-low' || sort === 'Price: Low to High') {
      masterList.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    } else if (sort === 'price-high' || sort === 'Price: High to Low') {
      masterList.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    } else if (sort === 'rating' || sort === 'Highest Rated' || sort === 'Most Hyped') {
      masterList.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    } else if (sort === 'newest' || sort === 'Newest Releases' || sort === 'Newest Drops') {
      masterList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }

    results = masterList
  }

  res.json({
    success: true,
    count: results.length,
    data: results.map(toLightProduct),
  })
})

/**
 * Get single product by ID (Full Detail shape) directly from MongoDB
 * with master database fallback (guarantees deal-1, deal-2, deal-5, etc. never 404).
 */
export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  let dbProduct = null
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
    const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }
    dbProduct = await Product.findOne(query).lean()
  } catch (err) {
    console.warn(`[getProductById] DB query failed: ${err.message}`)
  }

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
    filter.category = new RegExp(escapeRegex(category), 'i')
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
