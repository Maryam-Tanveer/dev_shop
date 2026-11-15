import Collection from '../models/Collection.js'
import Product from '../models/Product.js'
import { COLLECTIONS } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

// Mapping category aliases to collection categories
const CATEGORY_ALIASES = {
  'retro-basketball': 'shoes',
  'y2k-runners': 'shoes',
  'streetwear-essentials': 'clothing',
  'vault-collabs': 'collabs',
  'technical-outerwear': 'outerwear',
  'limited-drops-care': 'accessories',
}

export const getCollections = asyncHandler(async (req, res) => {
  const rawCat = (req.query.category || '').toLowerCase()
  const resolvedCategory = CATEGORY_ALIASES[rawCat] || rawCat
  const query = resolvedCategory && resolvedCategory !== 'all' ? { category: resolvedCategory } : {}
  let list = []

  try {
    list = await Collection.find(query).sort({ createdAt: 1 }).lean()
  } catch (err) {
    console.warn('[COLLECTIONS DB WARNING]:', err.message)
  }

  // Ensure DB returned authentic curated collections (not legacy product cards)
  const hasValidCollections =
    Array.isArray(list) &&
    list.length > 0 &&
    list.some((c) => c.targetCategory) &&
    !list.some((c) => c.productId)

  if (!hasValidCollections) {
    list = resolvedCategory && resolvedCategory !== 'all'
      ? COLLECTIONS.filter((col) => col.category === resolvedCategory || col.id === resolvedCategory)
      : COLLECTIONS
  }

  // Dynamically compute authoritative product item counts from the database
  try {
    list = await Promise.all(
      list.map(async (col) => {
        let prodFilter = {}
        const cat = (col.category || '').toLowerCase()

        if (cat === 'shoes') {
          prodFilter = { category: /Basketball|Running|Lifestyle|Skate|Trail Tech|Collabs/i }
        } else if (cat === 'clothing') {
          prodFilter = { category: /Streetwear|Apparel/i }
        } else if (cat === 'bags') {
          prodFilter = { $or: [{ category: /Bags|Packs/i }, { title: /pack|vest|bag|duffle/i }] }
        } else if (cat === 'outerwear') {
          prodFilter = { category: /Outerwear/i }
        } else if (cat === 'accessories') {
          prodFilter = { category: /Accessories|Vault Editions/i }
        } else if (cat === 'collabs') {
          prodFilter = { category: /Collabs/i }
        }

        const liveCount = await Product.countDocuments(prodFilter).catch(() => 0)
        const finalCount = liveCount > 0 ? liveCount : col.itemCount || 0
        const styleLabel = cat === 'shoes' ? 'FOOTWEAR' : cat === 'clothing' ? 'STREETWEAR' : cat === 'bags' ? 'BAGS & PACKS' : cat === 'outerwear' ? 'WEATHERPROOF SHELLS' : cat === 'accessories' ? 'CARE & DISPLAY' : 'EXCLUSIVE DROPS'

        return {
          ...col,
          itemCount: finalCount,
          badge: `${finalCount} STYLES • ${styleLabel}`,
        }
      })
    )
  } catch (err) {
    console.warn('[COLLECTIONS COUNT WARNING]:', err.message)
  }

  res.json({
    success: true,
    count: list.length,
    data: list,
  })
})

export const getCollectionById = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
  const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }
  const collection = await Collection.findOne(query).lean()

  if (!collection) {
    return next(new AppError(`Collection with id '${id}' not found`, 404))
  }

  res.json({
    success: true,
    data: collection,
  })
})
