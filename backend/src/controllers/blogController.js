import Blog from '../models/Blog.js'
import { BLOGS } from '../data/mockData.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

export const getBlogs = asyncHandler(async (req, res) => {
  const { category } = req.query
  const filter = {}

  if (category && category.toLowerCase() !== 'all') {
    filter.category = new RegExp(`^${category}$`, 'i')
  }

  let blogs = null
  try {
    const totalCount = await Blog.countDocuments().catch(() => 0)
    if (totalCount > 0) {
      blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean()
    }
  } catch (err) {
    console.warn(`[getBlogs] DB query failed: ${err.message}`)
  }

  if (!blogs) {
    let fallback = [...BLOGS]
    if (category && category.toLowerCase() !== 'all') {
      fallback = fallback.filter(
        (b) => (b.category || '').toLowerCase() === category.toLowerCase()
      )
    }
    blogs = fallback
  }

  res.json({
    success: true,
    count: blogs.length,
    data: blogs,
  })
})

export const getBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  let blog = null
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
    const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }
    blog = await Blog.findOne(query).lean()
  } catch (err) {
    console.warn(`[getBlogById] DB query failed: ${err.message}`)
  }

  if (!blog) {
    blog = BLOGS.find((b) => b.id === id || String(b._id) === id)
  }

  if (!blog) {
    return next(new AppError(`Blog post with id '${id}' not found`, 404))
  }

  res.json({
    success: true,
    data: blog,
  })
})
