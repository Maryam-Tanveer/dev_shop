import { FAQ_CATEGORIES, FAQ_DATA } from '../data/mockData.js'

export const getFaqs = (req, res) => {
  const { category } = req.query
  let data = [...FAQ_DATA]

  if (category && category !== 'all') {
    data = data.filter((item) => item.category === category)
  }

  res.json({
    success: true,
    count: data.length,
    data,
    categories: FAQ_CATEGORIES
  })
}

export const getFaqCategories = (req, res) => {
  res.json({
    success: true,
    count: FAQ_CATEGORIES.length,
    data: FAQ_CATEGORIES
  })
}
