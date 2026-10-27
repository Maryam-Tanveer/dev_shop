import crypto from 'crypto'
import {
  findUserByEmail,
  createUser,
  comparePassword,
  sanitizeUser,
} from '../data/users.js'
import { generateToken, extractToken } from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getDBStatus } from '../config/db.js'
import { OAuth2Client } from 'google-auth-library'
import { revokeToken } from '../services/tokenBlacklist.js'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || undefined)

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

const INVALID_CREDENTIALS_MSG = 'Invalid email or password. Please verify your credentials and try again.'

/**
 * Cryptographically verifies a Google ID Token using official google-auth-library
 */
export async function verifyGoogleIdToken(token) {
  if (!token || typeof token !== 'string') {
    throw new AppError('Google ID token is required', 400)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: clientId || undefined,
  })

  const payload = ticket.getPayload()
  if (!payload) {
    throw new AppError('Invalid Google token payload', 401)
  }

  if (!payload.email) {
    throw new AppError('Google ID token does not contain a verified email address', 400)
  }

  if (!payload.email_verified) {
    throw new AppError('Google email address is not verified by Google', 403)
  }

  return {
    email: payload.email.toLowerCase(),
    name: payload.name || payload.given_name || 'Google Collector',
    avatar: payload.picture || '',
    googleId: payload.sub,
  }
}

/**
 * User Login with Email & Password
 * Returns JWT token and sanitized user profile
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const user = await User.findOne({ email }).select('+password')
      if (user) {
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
          return next(new AppError(INVALID_CREDENTIALS_MSG, 401))
        }
        const token = generateToken(user)
        const safeUser = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          tier: user.memberTier,
        }

        // Set secure httpOnly cookie
        res.cookie('token', token, getCookieOptions())

        return res.json({
          success: true,
          token,
          user: safeUser,
          message: 'Successfully authenticated.',
        })
      } else {
        // Return same error even if user does not exist (prevents email enumeration)
        return next(new AppError(INVALID_CREDENTIALS_MSG, 401))
      }
    } catch (e) {
      // In production, refuse to fall back to RAM demo users
      if (process.env.NODE_ENV === 'production') {
        return next(new AppError('Database error during authentication.', 500))
      }
    }
  }

  // Refuse in-memory fallback in production to prevent data loss and unauthorized demo accounts
  if (process.env.NODE_ENV === 'production') {
    return next(
      new AppError('Database connection unavailable. In-memory demo fallback is disabled in production.', 503)
    )
  }

  const user = findUserByEmail(email)
  if (!user) {
    return next(new AppError(INVALID_CREDENTIALS_MSG, 401))
  }

  const isMatch = await comparePassword(password, user.passwordHash)
  if (!isMatch) {
    return next(new AppError(INVALID_CREDENTIALS_MSG, 401))
  }

  const token = generateToken(user)
  const safeUser = sanitizeUser(user)

  res.cookie('token', token, getCookieOptions())

  res.json({
    success: true,
    token,
    user: safeUser,
    message: 'Successfully authenticated.',
  })
})

/**
 * User Registration with Email, Password & Name
 * Hashes password using bcrypt and generates JWT
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const existing = await User.findOne({ email })
      if (existing) {
        return next(
          new AppError('An account with this email is already registered. Please sign in instead.', 409)
        )
      }
      const newUser = await User.create({ name, email, password })
      const token = generateToken(newUser)
      const safeUser = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        tier: newUser.memberTier,
      }

      res.cookie('token', token, getCookieOptions())

      return res.status(201).json({
        success: true,
        token,
        user: safeUser,
        message: 'Account created successfully in database.',
      })
    } catch (err) {
      if (err.code === 11000) {
        return next(
          new AppError('An account with this email is already registered. Please sign in instead.', 409)
        )
      }
      if (process.env.NODE_ENV === 'production') {
        return next(new AppError('Database error during account registration.', 500))
      }
    }
  }

  // Refuse in-memory fallback in production to prevent silent data loss
  if (process.env.NODE_ENV === 'production') {
    return next(
      new AppError('Database connection unavailable. In-memory demo fallback is disabled in production.', 503)
    )
  }

  const existingUser = findUserByEmail(email)
  if (existingUser) {
    return next(
      new AppError('An account with this email is already registered. Please sign in instead.', 409)
    )
  }

  const newUser = await createUser({
    name,
    email,
    password,
    tier: 'VAULT ROOKIE MEMBER',
  })

  const token = generateToken(newUser)
  const safeUser = sanitizeUser(newUser)

  res.cookie('token', token, getCookieOptions())

  res.status(201).json({
    success: true,
    token,
    user: safeUser,
    message: 'Account created successfully.',
  })
})

/**
 * Get current authenticated user profile
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  })
})

/**
 * Google OAuth sign in / token handler
 * Cryptographically verifies Google ID Token via google-auth-library
 */
export const googleAuth = asyncHandler(async (req, res, next) => {
  const rawToken = req.body.idToken || req.body.token || req.body.credential

  if (!rawToken) {
    return next(new AppError('Google ID token is required for authentication', 400))
  }

  // 1. Verify Google ID token cryptographically with Google's servers
  let googleData
  try {
    googleData = await verifyGoogleIdToken(rawToken)
  } catch (err) {
    return next(err instanceof AppError ? err : new AppError(`Google verification failed: ${err.message}`, 401))
  }

  const { email, name, avatar } = googleData

  // 2. Prevent account takeover: Admin accounts cannot be hijacked via Google OAuth
  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      let dbUser = await User.findOne({ email })
      if (dbUser) {
        if (dbUser.role === 'admin') {
          return next(
            new AppError('Administrator accounts cannot be accessed via Google sign-in. Please use administrator credentials.', 403)
          )
        }
      } else {
        dbUser = await User.create({
          name: name || 'Google Collector',
          email,
          password: `google-oauth-${Date.now()}-${crypto.randomBytes(16).toString('hex')}`,
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          memberTier: 'GOOGLE AUTH MEMBER',
          role: 'member',
        })
      }

      const token = generateToken(dbUser)
      const safeUser = {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role || 'member',
        avatar: dbUser.avatar,
        tier: dbUser.memberTier,
      }

      res.cookie('token', token, getCookieOptions())

      return res.json({
        success: true,
        token,
        user: safeUser,
      })
    } catch (err) {
      console.warn('[GOOGLE AUTH DB NOTICE]:', err.message)
      if (process.env.NODE_ENV === 'production') {
        return next(new AppError('Database error during Google authentication.', 500))
      }
    }
  }

  // Refuse in-memory fallback in production
  if (process.env.NODE_ENV === 'production') {
    return next(
      new AppError('Database connection unavailable. In-memory demo fallback is disabled in production.', 503)
    )
  }

  let user = findUserByEmail(email)
  if (user) {
    if (user.role === 'admin') {
      return next(
        new AppError('Administrator accounts cannot be accessed via Google sign-in. Please use administrator credentials.', 403)
      )
    }
  } else {
    user = await createUser({
      name: name || 'Google Collector',
      email,
      password: `google-oauth-${Date.now()}-${crypto.randomBytes(16).toString('hex')}`,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      tier: 'GOOGLE AUTH MEMBER',
      role: 'member',
    })
  }

  const token = generateToken(user)
  const safeUser = sanitizeUser(user)

  res.cookie('token', token, getCookieOptions())

  res.json({
    success: true,
    token,
    user: safeUser,
  })
})

/**
 * User Logout
 * Revokes the current JWT token in the blacklist and clears httpOnly auth cookie
 */
export const logout = asyncHandler(async (req, res) => {
  const token = extractToken(req)
  if (token) {
    await revokeToken(token)
  }
  res.clearCookie('token', getCookieOptions())
  return res.json({
    success: true,
    message: 'Successfully logged out. Session has been revoked.',
  })
})
