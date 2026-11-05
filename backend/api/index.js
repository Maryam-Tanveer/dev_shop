import app from '../src/server.js'
import { connectDB } from '../src/config/db.js'

export default async function handler(req, res) {
  // Normalize URL if Vercel internal rewrite passes destination path
  if (req.url && req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '') || '/'
  }
  await connectDB()
  return app(req, res)
}
