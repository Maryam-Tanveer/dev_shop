import jwt from 'jsonwebtoken'
import { findUserById, sanitizeUser } from '../data/users.js'

const JWT_SECRET = process.env.JWT_SECRET || 'devshop_super_secret_jwt_vault_key_2026'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Generate standard signed JWT token for user
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Middleware to require and verify valid JWT Bearer token
 */
export const requireAuth = (req, res, next) => {
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

    const user = findUserById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with this token no longer exists.',
      })
    }

    req.user = sanitizeUser(user)
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
 * Middleware to require Admin privileges (either secret x-admin-key or admin user role)
 */
export const requireAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key']
  const validKey = process.env.ADMIN_SECRET_KEY || 'DEV_VAULT_ADMIN_2026'

  if (adminKey && adminKey === validKey) {
    return next()
  }

  // Check bearer token if no direct admin key header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = findUserById(decoded.id)
      if (user && user.role === 'admin') {
        req.user = sanitizeUser(user)
        return next()
      }
    } catch {
      // Fall through to 403
    }
  }

  return res.status(403).json({
    success: false,
    error: 'Access denied: Admin credentials or valid x-admin-key required.',
  })
}
