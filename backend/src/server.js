import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectDB, getDBStatus } from './config/db.js'
import { apiLimiter } from './middleware/security.js'
import errorHandler from './middleware/errorHandler.js'
import AppError from './utils/AppError.js'

// Route Imports
import productRoutes from './routes/productRoutes.js'
import dropRoutes from './routes/dropRoutes.js'
import collectionRoutes from './routes/collectionRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import faqRoutes from './routes/faqRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import userRoutes from './routes/userRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import cookieParser from 'cookie-parser'

dotenv.config()

if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
  console.warn('[SECURITY WARNING] Missing required environment variable: JWT_SECRET is not set in environment variables! Auth endpoints will strictly refuse requests until configured.')
}

const app = express()
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'production'

// Connect to MongoDB Database (with seamless offline fallback)
connectDB()

// 1. HTTP Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
)

// 2. CORS Security Configuration
const defaultOrigins = [
  'https://dev-shop-bay.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]

const configuredOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : []

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]))

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, Postman, curl, or server-to-server calls)
      if (!origin) {
        return callback(null, true)
      }

      // Check if origin is explicitly in allowed list or localhost in non-production
      const isAllowed =
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(origin))

      if (isAllowed) {
        return callback(null, true)
      }

      // Strictly reject unauthorized origins
      const corsError = new AppError(`CORS blocked: Origin '${origin}' is not authorized.`, 403)
      return callback(corsError, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

// 3. Body parsers with payload size limits and rawBody preservation for Stripe webhook
app.use(
  express.json({
    limit: '10kb',
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
)
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// 4. Rate Limiting for all /api endpoints
app.use('/api', apiLimiter)

// Ensure MongoDB connection is ready before handling requests (crucial for Serverless Vercel)
app.use(async (req, res, next) => {
  const hasUri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (hasUri && !getDBStatus().connected) {
    try {
      await connectDB()
    } catch {
      // Graceful continuation
    }
  }
  next()
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  const missingEnv = []
  if (!process.env.JWT_SECRET) missingEnv.push('JWT_SECRET')
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) missingEnv.push('MONGO_URI')
  if (!process.env.STRIPE_SECRET_KEY) missingEnv.push('STRIPE_SECRET_KEY')

  res.json({
    status: missingEnv.length ? 'degraded' : 'ok',
    environment: NODE_ENV,
    uptime: `${process.uptime().toFixed(1)}s`,
    database: getDBStatus(),
    missingEnv: missingEnv.length ? missingEnv : undefined,
    message: missingEnv.length
      ? `Dev Shop API is active but missing environment variables in deployment: ${missingEnv.join(', ')}`
      : 'Dev Shop Drop Vault API is operational',
    timestamp: new Date().toISOString(),
  })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/drops', dropRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/faqs', faqRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/user', userRoutes)

// 404 Handler for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Route not found on this server.`, 404))
})

// Global Centralized Error Handling Middleware
app.use(errorHandler)

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[DEV SHOP API] Server listening at http://localhost:${PORT} in ${NODE_ENV} mode`)
  })
}

export default app
