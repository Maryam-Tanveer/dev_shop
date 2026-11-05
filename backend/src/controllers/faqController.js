import Faq from '../models/Faq.js'
import { FAQ_CATEGORIES } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getFaqs = asyncHandler(async (req, res) => {
  const { category } = req.query
  const query = category && category !== 'all' ? { category } : {}
  const data = await Faq.find(query).sort({ createdAt: 1 }).lean()

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
