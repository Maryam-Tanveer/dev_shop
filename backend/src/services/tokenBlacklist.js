import jwt from 'jsonwebtoken'
import RevokedToken from '../models/RevokedToken.js'
import { getDBStatus } from '../config/db.js'

// In-memory fallback set for offline/local development
const memoryBlacklist = new Set()

/**
 * Revoke a JWT token upon logout
 */
export const revokeToken = async (token) => {
  if (!token) return

  let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  try {
    const decoded = jwt.decode(token)
    if (decoded?.exp) {
      expiresAt = new Date(decoded.exp * 1000)
    }
  } catch {}

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      await RevokedToken.create({ token, expiresAt })
      return
    } catch (e) {
      // Token might already be revoked
    }
  }

  memoryBlacklist.add(token)
}

/**
 * Check if a token has been revoked
 */
export const isTokenRevoked = async (token) => {
  if (!token) return false

  if (memoryBlacklist.has(token)) {
    return true
  }

  const dbStatus = getDBStatus()
  if (dbStatus.connected) {
    try {
      const found = await RevokedToken.findOne({ token }).lean()
      return !!found
    } catch {}
  }

  return false
}
