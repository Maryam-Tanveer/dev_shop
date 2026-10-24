import {
  findUserByEmail,
  createUser,
  comparePassword,
  sanitizeUser,
} from '../data/users.js'
import { generateToken } from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getDBStatus } from '../config/db.js'

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
          return next(new AppError('Incorrect password. Please verify and try again.', 401))
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
        return res.json({
          success: true,
          token,
          user: safeUser,
          message: 'Successfully authenticated.',
        })
      }
    } catch {
      // Fallback to in-memory store
    }
  }

  const user = findUserByEmail(email)
  if (!user) {
    return next(
      new AppError('No account found with this email. Please check your spelling or sign up.', 401)
    )
  }

  const isMatch = await comparePassword(password, user.passwordHash)
  if (!isMatch) {
    return next(new AppError('Incorrect password. Please verify and try again.', 401))
  }

  const token = generateToken(user)
  const safeUser = sanitizeUser(user)

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
    }
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
 */
export const googleAuth = asyncHandler(async (req, res) => {
  const { email, name, avatar } = req.body

  let user = findUserByEmail(email)
  if (!user) {
    user = await createUser({
      name: name || 'Google Collector',
      email,
      password: `google-oauth-${Date.now()}-${Math.random()}`,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      tier: 'GOOGLE AUTH MEMBER',
    })
  }

  const token = generateToken(user)
  const safeUser = sanitizeUser(user)

  res.json({
    success: true,
    token,
    user: safeUser,
  })
})
