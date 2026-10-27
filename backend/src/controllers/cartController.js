import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Authoritative product lookup from MongoDB
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

  return null
}

/**
 * Controller to price and hydrate cart items with authoritative MongoDB data.
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

    // Authoritative lookup directly from MongoDB
    const product = await getAuthoritativeProduct(productId)

    if (!product) {
      console.warn(`[Cart Pricing] Product '${productId}' not found in database catalog`)
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
    let itemImage = product.image || ''
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
      id: variantKey,
      productId: product.id,
      title: product.title,
      fullTitle: product.fullTitle || product.title,
      brand: product.brand || 'Dev Shop',
      category: product.category || 'Sneakers',
      colorway: colorway || (product.colorways?.[0]?.name || 'Standard'),
      size: size,
      quantity: quantity,
      price: serverPrice, // AUTHORITATIVE DATABASE PRICE
      originalPrice: serverOriginalPrice,
      image: itemImage,
      badge: product.badge || 'CERTIFIED',
      badgeColor: product.badgeColor || 'bg-neutral-900 text-white',
      condition: product.condition || 'Deadstock Authentic',
      tag: product.tag || 'Vault Certified',
      spec: product.fullTitle || ''
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
