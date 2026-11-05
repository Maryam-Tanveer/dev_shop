import Collection from '../models/Collection.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

export const getCollections = asyncHandler(async (req, res) => {
  const { category } = req.query
  const query = category && category !== 'all' ? { category } : {}
  const list = await Collection.find(query).sort({ createdAt: 1 }).lean()
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
