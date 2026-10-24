import { RETRO_JORDANS } from './retroJordans'
import { YEEZY_COLLECTION } from './yeezyCollection'
import { RUNNING_LIFESTYLE } from './runningLifestyle'
import { VAULT_HARDWARE } from './vaultHardware'

// Combined Products Database matching legacy lookup by product ID
const RAW_DATABASE = {
  ...VAULT_HARDWARE,
  ...RETRO_JORDANS,
  ...YEEZY_COLLECTION,
  ...RUNNING_LIFESTYLE,
}

/**
 * Standard Lightweight Product Shape (for lists, grids, carousels, searches)
 */
export const toLightProduct = (p) => {
  if (!p) return null

  const mainImg = p.image || p.thumbnails?.[0]?.image || ''
  const origPrice = p.originalPrice || (p.price && p.saveAmount ? Number(p.price) + 40 : null)
  const discount = origPrice && origPrice > p.price
    ? Math.round(((origPrice - p.price) / origPrice) * 100)
    : null

  // Determine badge and badgeType
  let badge = p.badge
  let badgeType = p.badgeType || 'default'
  let badgeColor = p.badgeColor || 'bg-[#c81d25] text-white'

  if (!badge) {
    if (p.isNew) {
      badge = 'NEW DROP'
      badgeType = 'hot'
      badgeColor = 'bg-[#c81d25] text-white'
    } else if (discount) {
      badge = `-${discount}% OFF`
      badgeType = 'discount'
      badgeColor = 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
    } else {
      badge = p.tag || 'CERTIFIED'
      badgeType = 'default'
      badgeColor = 'bg-neutral-900 text-white'
    }
  }

  return {
    id: p.id,
    title: p.title || '',
    fullTitle: p.fullTitle || p.title || '',
    brand: p.brand || '',
    category: p.category || 'Sneakers',
    price: Number(p.price) || 0,
    originalPrice: origPrice ? Number(origPrice) : null,
    discountPercent: discount,
    saveAmount: p.saveAmount || (discount ? `SAVE $${(origPrice - p.price).toFixed(2)} (${discount}% OFF)` : null),
    badge,
    badgeType,
    badgeColor,
    tag: p.tag || 'Vault Certified',
    subTag: p.subTag || 'IN VAULT TODAY',
    stockStatus: p.stockStatus || (p.isUnavailable ? 'TBA' : 'In Stock'),
    stock: p.stock !== undefined ? p.stock : (p.soldCount ? Math.max(5, 50 - (p.soldCount % 40)) : 15),
    rating: p.rating || 5.0,
    reviews: p.reviews || 48,
    image: mainImg,
    isNew: Boolean(p.isNew),
    isDeal: Boolean(p.isDeal || p.originalPrice || p.badgeType === 'discount' || (typeof p.id === 'string' && p.id.startsWith('deal-'))),
    isUnavailable: Boolean(p.isUnavailable)
  }
}

/**
 * Standard Full Detail Product Shape (for product details page)
 */
export const toDetailProduct = (p) => {
  if (!p) return null
  const light = toLightProduct(p)

  const normalizedThumbnails = p.thumbnails && p.thumbnails.length > 0
    ? p.thumbnails
    : [
        { id: 'profile', label: 'FRONT', image: light.image },
        { id: 'side', label: 'PROFILE', image: light.image },
        { id: 'sole', label: 'SOLE GRIP', image: light.image },
        { id: 'box', label: 'UNBOX', image: light.image },
      ]

  const normalizedColorways = p.colorways && p.colorways.length > 0
    ? p.colorways
    : [
        { id: 'default', name: 'Original Colorway', color: '#171717' }
      ]

  const normalizedSizes = p.sizes && p.sizes.length > 0
    ? p.sizes
    : [
        { size: '8.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
        { size: '8.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
        { size: '9.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
        { size: '9.5', status: '2 Left', badgeColor: 'text-[#c81d25] font-extrabold' },
        { size: '10.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
        { size: '10.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
        { size: '11.0', status: 'Low', badgeColor: 'text-amber-600 font-bold' },
      ]

  return {
    ...light,
    thumbnails: normalizedThumbnails,
    colorways: normalizedColorways,
    sizes: normalizedSizes,
    description: p.description || `${p.title} is precision engineered for high-performance comfort and iconic street aesthetic with guaranteed physical vault authentication.`,
    descriptionSecond: p.descriptionSecond || 'Features shock-absorbing midsole cushioning, durable rubber tread traction, and hand-inspected finishing.',
    feature1Title: p.feature1Title || 'PREMIUM MATERIALS',
    feature1Subtitle: p.feature1Subtitle || 'Multi-Layer Construction',
    feature1Desc: p.feature1Desc || 'Engineered with hand-stitched detailing and high-grade composite overlays.',
    feature2Title: p.feature2Title || 'DYNAMIC AIR-CUSHION',
    feature2Subtitle: p.feature2Subtitle || 'High-Impact Rebound',
    feature2Desc: p.feature2Desc || 'Cushioned footbed provides all-day structural stability and energy return.',
    releaseCode: p.releaseCode || `DS-${(p.id || 'PROD').toUpperCase()}-2024`,
    globalAllocation: p.globalAllocation || 'Limited Tier-0 Release',
    weight: p.weight || '380g (Size 9 US)',
    origin: p.origin || 'Certified Dev Shop Vault',
    soldCount: p.soldCount || 120,
    verified: p.verified !== undefined ? p.verified : true,
    dropCode: p.dropCode || 'DROP 05',
    edition: p.edition || '2024 ARCHIVE'
  }
}

// Full detail database map
export const PRODUCTS_DATABASE = Object.fromEntries(
  Object.entries(RAW_DATABASE).map(([key, item]) => [key, toDetailProduct(item)])
)

// Flat array of all full detail products
export const ALL_PRODUCTS = Object.values(PRODUCTS_DATABASE)

// Flat array of all lightweight products for lists/catalogs
export const LIGHT_PRODUCTS = ALL_PRODUCTS.map(toLightProduct)

// Lookup single product by ID (returns Full Detail shape or null)
export const getProductById = (id) => {
  if (!id) return null
  const item = PRODUCTS_DATABASE[id]
  return item ? toDetailProduct(item) : null
}

// Filter products by brand
export const getProductsByBrand = (brand) => {
  if (!brand || brand === 'All') return LIGHT_PRODUCTS
  const lower = brand.toLowerCase()
  return LIGHT_PRODUCTS.filter((p) => p.brand?.toLowerCase().includes(lower))
}

// Filter products by category
export const getProductsByCategory = (category) => {
  if (!category || category === 'All') return LIGHT_PRODUCTS
  const lower = category.toLowerCase()
  return LIGHT_PRODUCTS.filter((p) => p.category?.toLowerCase().includes(lower))
}

// Search products by title, brand, or edition
export const searchProducts = (query, limit = 5) => {
  if (!query || query.trim().length === 0) return []
  const q = query.toLowerCase()
  return LIGHT_PRODUCTS.filter((p) => {
    return (
      p.title?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.fullTitle?.toLowerCase().includes(q)
    )
  }).slice(0, limit)
}

// Re-export individual categories for modular imports
export {
  RETRO_JORDANS,
  YEEZY_COLLECTION,
  RUNNING_LIFESTYLE,
  VAULT_HARDWARE,
}

export default PRODUCTS_DATABASE
