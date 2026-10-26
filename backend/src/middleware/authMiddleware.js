import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { findUserById, sanitizeUser } from '../data/users.js'
import User from '../models/User.js'
import { getDBStatus } from '../config/db.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || !JWT_SECRET.trim()) {
  throw new Error('[SECURITY FATAL] JWT_SECRET environment variable is missing. Refusing to start server with fallback secrets.')
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Generate standard signed JWT token for user
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id?.toString(),
      email: user.email,
      role: user.role || 'member',
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Resolve user by id from MongoDB or in-memory fallback
 */
const resolveUserById = async (id) => {
  if (!id) return null
  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const dbUser = await User.findById(id).lean()
      if (dbUser) {
        return {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role || 'member',
          avatar: dbUser.avatar,
          memberTier: dbUser.memberTier,
          addresses: dbUser.addresses || [],
        }
      }
    } catch {
      // Continue to in-memory check
    }
  }

  const memUser = findUserById(id)
  if (memUser) {
    return sanitizeUser(memUser)
  }

  return null
}

/**
 * Middleware to require and verify valid JWT Bearer token
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token required. Please sign in.',
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await resolveUserById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with this token no longer exists.',
      })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session has expired. Please sign in again.',
      })
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token.',
    })
  }
}

/**
 * Middleware to require Admin privileges strictly via JWT (role === 'admin')
 * NOTE: x-admin-key system has been completely removed for security.
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Administrator authentication required. Please sign in with an admin account.',
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await resolveUserById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with this token no longer exists.',
      })
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Administrator privileges required.',
      })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session has expired. Please sign in again.',
      })
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid or unauthorized admin authentication token.',
    })
  }
}

/**
 * Optional authentication middleware:
 * If Bearer token is provided and valid, attaches req.user.
 * If no token or invalid token, proceeds without error (req.user remains undefined).
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await resolveUserById(decoded.id)
      if (user) {
        req.user = user
      }
    }
  } catch {
    // Proceed as unauthenticated guest
  }
  next()
}
