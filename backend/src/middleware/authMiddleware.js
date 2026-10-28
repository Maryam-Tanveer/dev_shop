import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { findUserById, sanitizeUser } from '../data/users.js'
import User from '../models/User.js'
import { getDBStatus } from '../config/db.js'

dotenv.config()

export const getJwtSecret = () => {
  const secret =
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV && process.env.NODE_ENV.length > 20 ? process.env.NODE_ENV : null) ||
    'devshop_super_secret_jwt_vault_production_key_2026_at_least_32_chars'
  return secret
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
    getJwtSecret(),
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
          tier: dbUser.memberTier,
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

import { isTokenRevoked } from '../services/tokenBlacklist.js'

/**
 * Universal helper to extract JWT token from httpOnly cookie or Authorization Bearer header
 */
export const extractToken = (req) => {
  if (req.cookies?.token) return req.cookies.token
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1]
  }
  return null
}

/**
 * Middleware to require and verify valid JWT Bearer or httpOnly cookie token
 */
export const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req)
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token required. Please sign in.',
      })
    }

    if (await isTokenRevoked(token)) {
      return res.status(401).json({
        success: false,
        error: 'Session has been revoked or logged out. Please sign in again.',
      })
    }

    const decoded = jwt.verify(token, getJwtSecret())

    const user = await resolveUserById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with this token no longer exists.',
      })
    }

    req.user = user
    req.token = token
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
    const token = extractToken(req)
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Administrator authentication required. Please sign in with an admin account.',
      })
    }

    if (await isTokenRevoked(token)) {
      return res.status(401).json({
        success: false,
        error: 'Session has been revoked or logged out. Please sign in again.',
      })
    }

    const decoded = jwt.verify(token, getJwtSecret())

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
    req.token = token
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
 * If token is provided in cookie or header, verifies and attaches req.user.
 * If no token or invalid token, proceeds without error (req.user remains undefined).
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req)
    if (token && !(await isTokenRevoked(token))) {
      const decoded = jwt.verify(token, getJwtSecret())
      const user = await resolveUserById(decoded.id)
      if (user) {
        req.user = user
        req.token = token
      }
    }
  } catch {
    // Proceed as unauthenticated guest
  }
  next()
}
