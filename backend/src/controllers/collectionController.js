import Collection from '../models/Collection.js'
import { COLLECTIONS } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

export const getCollections = asyncHandler(async (req, res) => {
  const { category } = req.query
  const query = category && category !== 'all' ? { category } : {}
  let list = []

  try {
    list = await Collection.find(query).sort({ createdAt: 1 }).lean()
  } catch (err) {
    console.warn('[COLLECTIONS DB WARNING]:', err.message)
  }

  // If DB returned old product-level mock data or is empty, use authoritative collections list
  const hasValidCollections =
    Array.isArray(list) &&
    list.length > 0 &&
    list.some((c) => c.targetCategory || (typeof c.id === 'string' && c.id.startsWith('col-')))

  if (!hasValidCollections) {
    list = category && category !== 'all'
      ? COLLECTIONS.filter((col) => col.category === category || col.id === category)
      : COLLECTIONS
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
