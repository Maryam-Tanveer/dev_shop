import { COLLECTIONS } from '../data/mockData.js'

export const getCollections = (req, res) => {
  res.json({
    success: true,
    count: COLLECTIONS.length,
    data: COLLECTIONS
  })
}

export const getCollectionById = (req, res) => {
  const { id } = req.params
  const collection = COLLECTIONS.find((c) => c.id === id)

  if (!collection) {
    return res.status(404).json({
      success: false,
      error: `Collection with id '${id}' not found`
    })
  }

  res.json({
    success: true,
    data: collection
  })
}
