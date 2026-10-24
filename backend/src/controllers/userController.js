import User from '../models/User.js'
import {
  findUserById,
  updateUserProfile,
  changeUserPassword,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  sanitizeUser,
} from '../data/users.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { getDBStatus } from '../config/db.js'

/**
 * GET /api/user/profile
 * Get current user full profile with addresses
 */
export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const dbStatus = getDBStatus()

  if (dbStatus.connected) {
    try {
      const user = await User.findById(userId)
      if (user) {
        return res.json({
          success: true,
          data: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone || '',
            bio: user.bio || '',
            role: user.role,
            memberTier: user.memberTier,
            addresses: user.addresses || [],
          },
        })
      }
    } catch {}
  }

  const user = findUserById(userId)
  if (!user) {
    return next(new AppError('User profile not found', 404))
  }

  res.json({
    success: true,
    data: sanitizeUser(user),
  })
})

/**
 * PUT /api/user/profile
 * Update name, avatar, phone, bio
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const { name, avatar, phone, bio } = req.body
  const dbStatus = getDBStatus()

  if (!name || !name.trim()) {
    return next(new AppError('Name cannot be empty', 400))
  }

  if (dbStatus.connected) {
    try {
      const user = await User.findById(userId)
      if (user) {
        user.name = name.trim()
        if (avatar !== undefined) user.avatar = avatar
        if (phone !== undefined) user.phone = phone.trim()
        if (bio !== undefined) user.bio = bio.trim()

        await user.save()

        return res.json({
          success: true,
          message: 'Profile updated successfully',
          data: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            bio: user.bio,
            role: user.role,
            memberTier: user.memberTier,
            addresses: user.addresses || [],
          },
        })
      }
    } catch (e) {
      return next(new AppError(e.message || 'Failed to update profile in database', 400))
    }
  }

  const updatedUser = updateUserProfile(userId, { name, avatar, phone, bio })
  if (!updatedUser) {
    return next(new AppError('User not found in memory store', 404))
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  })
})

/**
 * PUT /api/user/password
 * Change password by verifying current password
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const { currentPassword, newPassword } = req.body
  const dbStatus = getDBStatus()

  if (!currentPassword || !newPassword) {
    return next(new AppError('Current password and new password are required', 400))
  }

  if (newPassword.length < 6) {
    return next(new AppError('New password must be at least 6 characters long', 400))
  }

  if (dbStatus.connected) {
    try {
      const user = await User.findById(userId).select('+password')
      if (user) {
        const isMatch = await user.matchPassword(currentPassword)
        if (!isMatch) {
          return next(new AppError('Current password is incorrect', 400))
        }

        user.password = newPassword
        await user.save()

        return res.json({
          success: true,
          message: 'Password changed successfully',
        })
      }
    } catch (e) {
      return next(new AppError(e.message || 'Failed to change password', 500))
    }
  }

  const result = await changeUserPassword(userId, currentPassword, newPassword)
  if (!result.success) {
    return next(new AppError(result.error || 'Failed to change password', 400))
  }

  res.json({
    success: true,
    message: 'Password changed successfully',
  })
})

/**
 * GET /api/user/addresses
 * Get all saved addresses for user
 */
export const getAddresses = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const dbStatus = getDBStatus()

  if (dbStatus.connected) {
    try {
      const user = await User.findById(userId)
      if (user) {
        return res.json({
          success: true,
          count: (user.addresses || []).length,
          data: user.addresses || [],
        })
      }
    } catch {}
  }

  const user = findUserById(userId)
  const addresses = user?.addresses || []

  res.json({
    success: true,
    count: addresses.length,
    data: addresses,
  })
})

/**
 * POST /api/user/addresses
 * Add a new shipping address
 */
export const addAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const addressData = req.body
  const dbStatus = getDBStatus()

  if (!addressData.address || !addressData.city || !addressData.state || !addressData.zipCode) {
    return next(new AppError('Street address, city, state, and zip code are required', 400))
  }

  if (dbStatus.connected) {
    try {
      const user = await User.findById(userId)
      if (user) {
        if (!user.addresses) user.addresses = []
        if (addressData.isDefault) {
          user.addresses.forEach((a) => (a.isDefault = false))
        } else if (user.addresses.length === 0) {
          addressData.isDefault = true
        }

        user.addresses.push(addressData)
        await user.save()

        return res.status(201).json({
          success: true,
          message: 'Address added successfully',
          data: user.addresses,
        })
      }
    } catch (e) {
      return next(new AppError(e.message || 'Failed to save address', 400))
    }
  }

  const addresses = addUserAddress(userId, addressData)
  if (!addresses) {
    return next(new AppError('User not found', 404))
  }

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: addresses,
  })
})

/**
 * PUT /api/user/addresses/:id
 * Update an existing address
 */
export const updateAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const addressId = req.params.id
  const addressData = req.body
  const dbStatus = getDBStatus()

  if (dbStatus.connected) {
    try {
      const user = await User.findById(userId)
      if (user && user.addresses) {
        const addrIndex = user.addresses.findIndex((a) => a.id === addressId)
        if (addrIndex === -1) {
          return next(new AppError('Address not found', 404))
        }

        if (addressData.isDefault) {
          user.addresses.forEach((a) => (a.isDefault = false))
        }

        Object.assign(user.addresses[addrIndex], addressData)
        await user.save()

        return res.json({
          success: true,
          message: 'Address updated successfully',
          data: user.addresses,
        })
      }
    } catch (e) {
      return next(new AppError(e.message || 'Failed to update address', 400))
    }
  }

  const addresses = updateUserAddress(userId, addressId, addressData)
  if (!addresses) {
    return next(new AppError('Address not found', 404))
  }

  res.json({
    success: true,
    message: 'Address updated successfully',
    data: addresses,
  })
})

/**
 * DELETE /api/user/addresses/:id
 * Delete a shipping address
 */
export const deleteAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const addressId = req.params.id
  const dbStatus = getDBStatus()

  if (dbStatus.connected) {
    try {
      const user = await User.findById(userId)
      if (user && user.addresses) {
        const wasDefault = user.addresses.find((a) => a.id === addressId)?.isDefault
        user.addresses = user.addresses.filter((a) => a.id !== addressId)

        if (wasDefault && user.addresses.length > 0) {
          user.addresses[0].isDefault = true
        }

        await user.save()

        return res.json({
          success: true,
          message: 'Address removed successfully',
          data: user.addresses,
        })
      }
    } catch (e) {
      return next(new AppError(e.message || 'Failed to delete address', 400))
    }
  }

  const addresses = deleteUserAddress(userId, addressId)
  if (!addresses) {
    return next(new AppError('Address not found', 404))
  }

  res.json({
    success: true,
    message: 'Address removed successfully',
    data: addresses,
  })
})
