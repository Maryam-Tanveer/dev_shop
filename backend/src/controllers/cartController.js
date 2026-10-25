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

/**
 * Robust product lookup by ID across all backend datasets
 */
export const lookupServerProduct = (id) => {
  if (!id) return null

  // 1. Direct key lookup in full detail database
  if (PRODUCTS_DATABASE[id]) {
    return PRODUCTS_DATABASE[id]
  }

  // 2. Case-insensitive key lookup in RAW_DATABASE
  const rawKey = Object.keys(RAW_DATABASE).find(
    (k) => k.toLowerCase() === id.toLowerCase()
  )
  if (rawKey && RAW_DATABASE[rawKey]) {
    return toDetailProduct(RAW_DATABASE[rawKey])
  }

  // 3. Find in flat ALL_PRODUCTS
  const inAll = ALL_PRODUCTS.find((p) => p.id === id)
  if (inAll) return inAll

  // 4. Find in mockData lists
  const inDeals = BEST_DEALS.find((d) => d.id === id)
  if (inDeals) return toDetailProduct(inDeals)

  const inRelated = RELATED_PRODUCTS.find((r) => r.id === id)
  if (inRelated) return toDetailProduct(inRelated)

  const inCross = CROSS_SELL_ITEMS.find((c) => c.id === id)
  if (inCross) return toDetailProduct(inCross)

  const inWishlist = WISHLIST_RECOMMENDATIONS.find((w) => w.id === id)
  if (inWishlist) return toDetailProduct(inWishlist)

  return null
}

/**
 * Controller to price and hydrate cart items with authoritative server-side data.
 * Request body: { items: [ { productId, size, colorway, qty } ] }
 * Ensures client never dictates item prices or discounts.
 */
export const priceCart = (req, res) => {
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
    const product = lookupServerProduct(productId)

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
}
