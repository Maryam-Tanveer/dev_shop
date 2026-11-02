import { COLLECTIONS } from '../data/mockData.js'

export const getCollections = (req, res) => {
  const { category } = req.query
  let list = COLLECTIONS || []
  if (category && category !== 'all') {
    list = list.filter((c) => c.category === category)
  }
  res.json({
    success: true,
    count: list.length,
    data: list
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
