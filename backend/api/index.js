import app from '../src/server.js'

export default function handler(req, res) {
  // Normalize URL if Vercel internal rewrite passes destination path
  if (req.url && req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '') || '/'
  }
  return app(req, res)
}
