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

export const getCookieOptions = (req) => {
  const isHttps = req ? Boolean(req.secure || req.headers['x-forwarded-proto'] === 'https') : false
  const isProduction = process.env.NODE_ENV === 'production' && isHttps
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

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
  const normalizedEmail = email ? email.trim().toLowerCase() : ''

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const user = await User.findOne({ email: normalizedEmail }).select('+password')
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
        res.cookie('token', token, getCookieOptions(req))

        return res.json({
          success: true,
          token,
          user: safeUser,
          message: 'Successfully authenticated.',
        })
      }
    } catch (e) {
      console.warn('[AUTH DB LOGIN ERROR]:', e.message)
    }
  }

  // Fallback to demo users in USERS (strictly permitted in development environment only)
  if (process.env.NODE_ENV !== 'production') {
    const demoUser = findUserByEmail(normalizedEmail)
    if (demoUser) {
      const isMatch = await comparePassword(password, demoUser.passwordHash)
      if (isMatch) {
        // If DB is connected, save the user into DB so it persists
        if (dbStatus.connected) {
          try {
            const created = await User.create({
              name: demoUser.name,
              email: demoUser.email,
              password: password,
              role: demoUser.role || 'member',
              avatar: demoUser.avatar || '',
              memberTier: demoUser.tier || 'Core Vault Member',
            })
            const token = generateToken(created)
            const safeUser = {
              id: created._id.toString(),
              name: created.name,
              email: created.email,
              role: created.role,
              avatar: created.avatar,
              tier: created.memberTier,
            }
            res.cookie('token', token, getCookieOptions(req))
            return res.json({
              success: true,
              token,
              user: safeUser,
              message: 'Successfully authenticated.',
            })
          } catch {
            // Continue to in-memory fallback
          }
        }

        const token = generateToken(demoUser)
        const safeUser = sanitizeUser(demoUser)
        res.cookie('token', token, getCookieOptions(req))
        return res.json({
          success: true,
          token,
          user: safeUser,
          message: 'Successfully authenticated.',
        })
      }
    }
  }

  return next(new AppError(INVALID_CREDENTIALS_MSG, 401))
})

/**
 * User Registration with Email, Password & Name
 * Hashes password using bcrypt and generates JWT
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body
  const normalizedEmail = email ? email.trim().toLowerCase() : ''
  const trimmedName = name && name.trim() ? name.trim() : normalizedEmail.split('@')[0]

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const existing = await User.findOne({ email: normalizedEmail })
      if (existing) {
        return next(
          new AppError('An account with this email is already registered. Please sign in instead.', 409)
        )
      }
      const newUser = await User.create({ name: trimmedName, email: normalizedEmail, password })
      const token = generateToken(newUser)
      const safeUser = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        tier: newUser.memberTier,
      }

      res.cookie('token', token, getCookieOptions(req))

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
      console.warn('[AUTH DB REGISTER ERROR]:', err.message)
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

  const existingUser = findUserByEmail(normalizedEmail)
  if (existingUser) {
    return next(
      new AppError('An account with this email is already registered. Please sign in instead.', 409)
    )
  }

  const newUser = await createUser({
    name: trimmedName,
    email: normalizedEmail,
    password,
    tier: 'VAULT ROOKIE MEMBER',
  })

  const token = generateToken(newUser)
  const safeUser = sanitizeUser(newUser)

  res.cookie('token', token, getCookieOptions(req))

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
  const accessToken = req.body.accessToken
  let googleData = null

  // 1. Verify Google ID token if provided
  if (rawToken) {
    try {
      googleData = await verifyGoogleIdToken(rawToken)
    } catch (err) {
      return next(err instanceof AppError ? err : new AppError(`Google verification failed: ${err.message}`, 401))
    }
  } else if (accessToken) {
    // 2. Cryptographically verify Google OAuth access token directly with Google API
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!response.ok) {
        return next(new AppError('Invalid Google access token', 401))
      }
      const payload = await response.json()
      if (!payload.email) {
        return next(new AppError('Google did not provide a verified email address', 400))
      }
      if (payload.email_verified === false) {
        return next(new AppError('Google email address is not verified by Google', 403))
      }
      googleData = {
        email: payload.email.toLowerCase(),
        name: payload.name || payload.given_name || 'Google Collector',
        avatar: payload.picture || '',
        googleId: payload.sub,
      }
    } catch (err) {
      return next(new AppError(`Google verification failed: ${err.message}`, 401))
    }
  }

  if (!googleData || !googleData.email) {
    return next(new AppError('A valid Google ID token or Access token is required for authentication', 400))
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

      res.cookie('token', token, getCookieOptions(req))

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

  res.cookie('token', token, getCookieOptions(req))

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
  res.clearCookie('token', getCookieOptions(req))
  return res.json({
    success: true,
    message: 'Successfully logged out. Session has been revoked.',
  })
})
