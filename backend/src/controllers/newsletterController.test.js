import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Newsletter Email Validation Logic', () => {
  const emailRegex = /^\S+@\S+\.\S+$/

  it('accepts valid email addresses', () => {
    const validEmails = [
      'user@example.com',
      'john.doe@domain.co.uk',
      'subscriber+vault@shop.io',
    ]

    for (const email of validEmails) {
      assert.equal(emailRegex.test(email.trim().toLowerCase()), true)
    }
  })

  it('rejects invalid email formats', () => {
    const invalidEmails = [
      '',
      '   ',
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      'user@domain',
    ]

    for (const email of invalidEmails) {
      assert.equal(emailRegex.test(email.trim().toLowerCase()), false)
    }
  })
})
