import Product from '../models/Product.js'
import Cart from '../models/Cart.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { calcTotals } from '../utils/pricing.js'
import { PRODUCTS_DATABASE, RAW_DATABASE } from '../data/products/index.js'

/**
 * Authoritative product lookup from MongoDB with seamless master database fallback
 */
export const getAuthoritativeProduct = async (id) => {
  if (!id) return null
  const cleanId = String(id).includes('::') ? String(id).split('::')[0] : String(id)

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(cleanId)
    const query = isObjectId ? { $or: [{ id: cleanId }, { _id: cleanId }] } : { id: cleanId }
    const dbProd = await Product.findOne(query).lean()
    if (dbProd) {
      return {
        id: dbProd.id || String(dbProd._id),
        title: dbProd.title,
        fullTitle: dbProd.fullTitle || dbProd.title,
        price: Number(dbProd.price) || 0,
        originalPrice: dbProd.originalPrice ? Number(dbProd.originalPrice) : null,
        image: dbProd.image || dbProd.images?.[0] || '',
        brand: dbProd.brand || 'Dev Shop',
        category: dbProd.category || 'Sneakers',
        colorways: (dbProd.colors || []).map((c) => ({
          name: c.name,
          color: c.hex,
          image: c.image || dbProd.image,
        })),
        badge: dbProd.badge || 'CERTIFIED',
        badgeColor: 'bg-neutral-900 text-white',
        condition: 'Deadstock Authentic',
        tag: 'Vault Certified',
      }
    }
  } catch (err) {
    console.warn('[DB Product Lookup]:', err.message)
  }

  // Master fallback if DB is not connected or item is not in DB yet
  const fallback = PRODUCTS_DATABASE[cleanId] || RAW_DATABASE[cleanId]
  if (fallback) {
    return {
      id: fallback.id,
      title: fallback.title,
      fullTitle: fallback.fullTitle || fallback.title,
      price: Number(fallback.price) || 0,
      originalPrice: fallback.originalPrice ? Number(fallback.originalPrice) : null,
      image: fallback.image || fallback.thumbnails?.[0]?.image || '',
      brand: fallback.brand || 'Dev Shop',
      category: fallback.category || 'Sneakers',
      colorways: (fallback.colorways || []).map((c) => ({
        name: c.name,
        color: c.color || c.hex,
        image: fallback.image,
      })),
      badge: fallback.badge || 'CERTIFIED',
      badgeColor: 'bg-neutral-900 text-white',
      condition: 'Deadstock Authentic',
      tag: 'Vault Certified',
    }
  }

  return null
}

/**
 * Helper to hydrate and calculate authoritative totals for cart items
 */
export const enrichCartItems = async (rawItems = [], shippingMethod = 'standard') => {
  const list = Array.isArray(rawItems) ? rawItems : []
  const enrichedItems = []

  for (const item of list) {
    const productId = item.productId || item.id
    if (!productId) continue

    const size = item.size || 'US 9.5'
    const colorway = item.colorway || ''
    const quantity = Math.max(1, parseInt(item.quantity ?? item.qty ?? 1, 10))

    const product = await getAuthoritativeProduct(productId)
    if (!product) {
      console.warn(`[Cart Pricing] Product '${productId}' not found in database catalog`)
      continue
    }

    const serverPrice = typeof product.price === 'number'
      ? product.price
      : parseFloat(product.price) || 0

    const serverOriginalPrice = product.originalPrice
      ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice))
      : serverPrice

    let itemImage = product.image || ''
    if (colorway && Array.isArray(product.colorways)) {
      const matchedColor = product.colorways.find(
        (c) => c.name?.toLowerCase() === colorway.toLowerCase()
      )
      if (matchedColor?.image) {
        itemImage = matchedColor.image
      }
    }

    const variantKey = `${productId}::${size}::${colorway || 'standard'}`

    enrichedItems.push({
      cartItemId: variantKey,
      id: variantKey,
      productId: product.id,
      title: product.title,
      fullTitle: product.fullTitle || product.title,
      brand: product.brand || 'Dev Shop',
      category: product.category || 'Sneakers',
      colorway: colorway || (product.colorways?.[0]?.name || 'Standard'),
      size: size,
      quantity: quantity,
      qty: quantity,
      price: serverPrice,
      originalPrice: serverOriginalPrice,
      image: itemImage,
      badge: product.badge || 'CERTIFIED',
      badgeColor: product.badgeColor || 'bg-neutral-900 text-white',
      condition: product.condition || 'Deadstock Authentic',
      tag: product.tag || 'Vault Certified',
      spec: product.fullTitle || '',
    })
  }

  const subtotal = Number(
    enrichedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  )
  const totals = calcTotals(subtotal, shippingMethod)
  const itemCount = enrichedItems.reduce((acc, item) => acc + item.quantity, 0)

  return {
    items: enrichedItems,
    subtotal: totals.subtotal,
    tax: totals.tax,
    shipping: totals.shippingCost,
    shippingCost: totals.shippingCost,
    shippingMethod: totals.shippingMethod,
    total: totals.totalAmount,
    totalAmount: totals.totalAmount,
    freeShippingThreshold: totals.freeShippingThreshold,
    itemCount,
  }
}

/**
 * Controller to price and hydrate cart items with authoritative MongoDB data.
 * Request body: { items: [ { productId, size, colorway, qty } ], shippingMethod }
 */
export const priceCart = asyncHandler(async (req, res) => {
  const rawItems = req.body.items || req.body
  const shippingMethod = req.body.shippingMethod || 'standard'
  const enriched = await enrichCartItems(rawItems, shippingMethod)

  res.json({
    success: true,
    data: enriched,
  })
})

/**
 * GET /api/cart
 * Fetch authenticated user cart from database and hydrate with authoritative prices
 */
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id
  if (!userId) {
    return res.json({
      success: true,
      data: {
        items: [],
        rawItems: [],
        itemCount: 0,
        subtotal: 0,
        total: 0,
      },
    })
  }

  const cart = await Cart.findOne({ userId }).lean()
  if (!cart || !cart.items || cart.items.length === 0) {
    return res.json({
      success: true,
      data: {
        items: [],
        rawItems: [],
        itemCount: 0,
        subtotal: 0,
        total: 0,
      },
    })
  }

  const enriched = await enrichCartItems(cart.items)
  res.json({
    success: true,
    data: {
      ...enriched,
      rawItems: cart.items.map((it) => ({
        productId: it.productId,
        size: it.size,
        colorway: it.colorway,
        qty: it.quantity,
      })),
    },
  })
})

/**
 * POST /api/cart/sync
 * Synchronize user cart items to MongoDB for persistence across devices
 */
export const syncCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id
  const rawItems = req.body.items || req.body || []
  const shippingMethod = req.body.shippingMethod || 'standard'

  const normalizedItems = (Array.isArray(rawItems) ? rawItems : [])
    .map((it) => ({
      productId: it.productId || it.id,
      size: it.size || 'US 9.5',
      colorway: it.colorway || 'Standard',
      quantity: Math.max(1, parseInt(it.quantity ?? it.qty ?? 1, 10)),
    }))
    .filter((it) => Boolean(it.productId))

  if (userId) {
    await Cart.findOneAndUpdate(
      { userId },
      { userId, items: normalizedItems },
      { upsert: true, new: true }
    )
  }

  const enriched = await enrichCartItems(normalizedItems, shippingMethod)

  res.json({
    success: true,
    data: {
      ...enriched,
      rawItems: normalizedItems.map((it) => ({
        productId: it.productId,
        size: it.size,
        colorway: it.colorway,
        qty: it.quantity,
      })),
    },
  })
})

/**
 * DELETE /api/cart
 * Clear user cart from MongoDB
 */
export const clearUserCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id
  if (userId) {
    await Cart.findOneAndUpdate({ userId }, { items: [] })
  }

  res.json({
    success: true,
    message: 'User cart cleared successfully',
  })
})
