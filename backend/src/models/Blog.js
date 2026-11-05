import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tag: {
      type: String,
      default: 'EDITORIAL',
    },
    author: {
      type: String,
      default: 'Dev Vault Lab',
    },
    date: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'all',
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
  },
  {
    timestamps: true,
  }
)

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
export default Blog
