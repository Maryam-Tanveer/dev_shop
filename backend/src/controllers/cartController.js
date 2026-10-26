import {
  PRODUCTS_DATABASE,
  RAW_DATABASE,
  toDetailProduct,
  ALL_PRODUCTS
} from '../data/products/index.js'
import {
  BEST_DEALS,
  RELATED_PRODUCTS,
  CROSS_SELL_ITEMS,
  WISHLIST_RECOMMENDATIONS
} from '../data/mockData.js'
import Product from '../models/Product.js'
import { getDBStatus } from '../config/db.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Asynchronous authoritative product lookup (checks MongoDB first if connected, then in-memory)
 */
export const getAuthoritativeProduct = async (id) => {
  if (!id) return null
  const cleanId = String(id).includes('::') ? String(id).split('::')[0] : String(id)

  // 1. Check MongoDB if connected
  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
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
          colorways: dbProd.colorways || [],
          badge: dbProd.badge || 'CERTIFIED',
          badgeColor: dbProd.badgeColor || 'bg-neutral-900 text-white',
          condition: dbProd.condition || 'Deadstock Authentic',
          tag: dbProd.tag || 'Vault Certified',
        }
      }
    } catch (err) {
      console.warn('[DB Product Lookup]:', err.message)
    }
  }

  // 2. Fallback to in-memory datasets
  const memProd = lookupServerProduct(cleanId)
  if (memProd) {
    return {
      id: memProd.id,
      title: memProd.title,
      fullTitle: memProd.fullTitle || memProd.title,
      price: typeof memProd.price === 'number' ? memProd.price : parseFloat(memProd.price) || 0,
      originalPrice: memProd.originalPrice
        ? typeof memProd.originalPrice === 'number'
          ? memProd.originalPrice
          : parseFloat(memProd.originalPrice)
        : null,
      image: memProd.image || memProd.thumbnails?.[0]?.image || '',
      brand: memProd.brand || 'Dev Shop',
      category: memProd.category || 'Sneakers',
      colorways: memProd.colorways || [],
      badge: memProd.badge || memProd.tag || 'CERTIFIED',
      badgeColor: memProd.badgeColor || 'bg-neutral-900 text-white',
      condition: memProd.condition || 'Deadstock Authentic',
      tag: memProd.tag || 'Vault Certified',
    }
  }

  return null
}

/**
 * Robust product lookup by ID across all backend datasets
 */
export const lookupServerProduct = (id) => {
  if (!id) return null
  const cleanId = String(id).includes('::') ? String(id).split('::')[0] : String(id)

  // 1. Direct key lookup in full detail database
  if (PRODUCTS_DATABASE[cleanId]) {
    return PRODUCTS_DATABASE[cleanId]
  }

  // 2. Case-insensitive key lookup in RAW_DATABASE
  const rawKey = Object.keys(RAW_DATABASE).find(
    (k) => k.toLowerCase() === cleanId.toLowerCase()
  )
  if (rawKey && RAW_DATABASE[rawKey]) {
    return toDetailProduct(RAW_DATABASE[rawKey])
  }

  // 3. Find in flat ALL_PRODUCTS
  const inAll = ALL_PRODUCTS.find((p) => p.id === cleanId)
  if (inAll) return inAll

  // 4. Find in mockData lists
  const inDeals = BEST_DEALS.find((d) => d.id === cleanId)
  if (inDeals) return toDetailProduct(inDeals)

  const inRelated = RELATED_PRODUCTS.find((r) => r.id === cleanId)
  if (inRelated) return toDetailProduct(inRelated)

  const inCross = CROSS_SELL_ITEMS.find((c) => c.id === cleanId)
  if (inCross) return toDetailProduct(inCross)

  const inWishlist = WISHLIST_RECOMMENDATIONS.find((w) => w.id === cleanId)
  if (inWishlist) return toDetailProduct(inWishlist)

  return null
}

/**
 * Controller to price and hydrate cart items with authoritative server-side data.
 * Request body: { items: [ { productId, size, colorway, qty } ] }
 * Ensures client never dictates item prices or discounts.
 */
export const priceCart = asyncHandler(async (req, res) => {
  const rawItems = Array.isArray(req.body.items)
    ? req.body.items
    : Array.isArray(req.body)
    ? req.body
    : []

  const enrichedItems = []

  for (const item of rawItems) {
    const productId = item.productId || item.id
    if (!productId) continue

    const size = item.size || 'US 9.5'
    const colorway = item.colorway || ''
    const quantity = Math.max(1, parseInt(item.quantity ?? item.qty ?? 1, 10))

    // Server-side authoritative lookup
    const product = await getAuthoritativeProduct(productId)

    if (!product) {
      console.warn(`[Cart Pricing] Product '${productId}' not found in server catalog`)
      continue
    }

    // Authoritative server-side pricing
    const serverPrice = typeof product.price === 'number'
      ? product.price
      : parseFloat(product.price) || 0

    const serverOriginalPrice = product.originalPrice
      ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice))
      : serverPrice

    // Check if a colorway-specific image exists
    let itemImage = product.image || product.thumbnails?.[0]?.image || ''
    if (colorway && Array.isArray(product.colorways)) {
      const matchedColor = product.colorways.find(
        (c) => c.name?.toLowerCase() === colorway.toLowerCase()
      )
      if (matchedColor?.image) {
        itemImage = matchedColor.image
      }
    }

    // Unique variant identifier: compound key of productId, size, and colorway
    const variantKey = `${productId}::${size}::${colorway || 'standard'}`

    enrichedItems.push({
      cartItemId: variantKey,
      id: variantKey, // Matches cartItemId so callers passing item.id always use the variant key
      productId: product.id,
      title: product.title,
      fullTitle: product.fullTitle || product.title,
      brand: product.brand || 'Dev Shop',
      category: product.category || 'Sneakers',
      colorway: colorway || (product.colorways?.[0]?.name || 'Standard'),
      size: size,
      quantity: quantity,
      price: serverPrice, // AUTHORITATIVE SERVER PRICE
      originalPrice: serverOriginalPrice,
      image: itemImage,
      badge: product.badge || product.tag || 'CERTIFIED',
      badgeColor: product.badgeColor || 'bg-neutral-900 text-white',
      condition: product.condition || 'Deadstock Authentic',
      tag: product.tag || 'Vault Certified',
      spec: product.feature1Subtitle || ''
    })
  }

  // Calculate authoritative server totals
  const subtotal = Number(
    enrichedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  )
  const tax = Number((subtotal * 0.08).toFixed(2))
  const shipping = subtotal === 0 || subtotal > 200 ? 0 : 25.00
  const total = Number((subtotal + tax + shipping).toFixed(2))
  const itemCount = enrichedItems.reduce((acc, item) => acc + item.quantity, 0)

  res.json({
    success: true,
    data: {
      items: enrichedItems,
      subtotal,
      tax,
      shipping,
      total,
      itemCount
    }
  })
})
