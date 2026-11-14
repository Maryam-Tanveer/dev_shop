import Faq from '../models/Faq.js'
import { FAQ_CATEGORIES, FAQ_DATA } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getFaqs = asyncHandler(async (req, res) => {
  const { category } = req.query
  const query = category && category !== 'all' ? { category } : {}
  let data = []

  try {
    data = await Faq.find(query).sort({ createdAt: 1 }).lean()
  } catch (err) {
    console.warn('[FAQ DB WARNING]:', err.message)
  }

  // Fallback to rich FAQ_DATA if DB collection has not been seeded yet
  if (!data || data.length === 0) {
    data = category && category !== 'all'
      ? FAQ_DATA.filter((item) => item.category === category)
      : FAQ_DATA
  }

  res.json({
    success: true,
    count: data.length,
    data,
    categories: FAQ_CATEGORIES,
  })
})

export const getFaqCategories = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    count: FAQ_CATEGORIES.length,
    data: FAQ_CATEGORIES,
  })
})
