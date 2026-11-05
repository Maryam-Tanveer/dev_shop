import Blog from '../models/Blog.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean()
  res.json({
    success: true,
    count: blogs.length,
    data: blogs,
  })
})

export const getBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)
  const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }
  const blog = await Blog.findOne(query).lean()

  if (!blog) {
    return next(new AppError(`Blog post with id '${id}' not found`, 404))
  }

  res.json({
    success: true,
    data: blog,
  })
})
