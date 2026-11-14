import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import { generateToken, getJwtSecret } from './authMiddleware.js'

describe('Auth Middleware & Token Security', () => {
  it('generates a valid signed JWT containing user properties', () => {
    const user = {
      id: 'usr_test_123',
      email: 'collector@devshop.io',
      role: 'member',
    }

    const token = generateToken(user)
    assert.ok(token)
    assert.equal(typeof token, 'string')

    const decoded = jwt.verify(token, getJwtSecret())
    assert.equal(decoded.id, 'usr_test_123')
    assert.equal(decoded.email, 'collector@devshop.io')
    assert.equal(decoded.role, 'member')
  })

  it('generates valid admin token with admin role', () => {
    const adminUser = {
      id: 'usr_admin_999',
      email: 'admin@devshop.io',
      role: 'admin',
    }

    const token = generateToken(adminUser)
    const decoded = jwt.verify(token, getJwtSecret())
    assert.equal(decoded.role, 'admin')
  })

  it('rejects tampered tokens', () => {
    const token = generateToken({ id: 'valid_user', email: 'test@devshop.io', role: 'member' })
    const tampered = token.slice(0, -5) + 'xyz12'

    assert.throws(() => {
      jwt.verify(tampered, getJwtSecret())
    })
  })
})
