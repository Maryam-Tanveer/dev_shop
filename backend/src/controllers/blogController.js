import { BLOGS } from '../data/mockData.js'

export const getBlogs = (req, res) => {
  res.json({
    success: true,
    count: BLOGS.length,
    data: BLOGS
  })
}

export const getBlogById = (req, res) => {
  const { id } = req.params
  const blog = BLOGS.find((b) => b.id === id)

  if (!blog) {
    return res.status(404).json({
      success: false,
      error: `Blog post with id '${id}' not found`
    })
  }

  res.json({
    success: true,
    data: blog
  })
}
