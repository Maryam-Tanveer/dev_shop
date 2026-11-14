import { describe, it, expect } from 'vitest'
import { createVariantKey } from './CartContext'

describe('Cart Variant Compound Key Utility', () => {
  it('creates standardized variant keys with defaults', () => {
    const key = createVariantKey('jordan-1-retro', 'US 10', 'Chicago')
    expect(key).toBe('jordan-1-retro::US 10::Chicago')
  })

  it('handles fallback default sizes and colorways', () => {
    const key = createVariantKey('yeezy-350', null, '')
    expect(key).toBe('yeezy-350::US 9.5::Standard')
  })

  it('trims whitespace around variant properties', () => {
    const key = createVariantKey('  dunk-low  ', '  US 11  ', '  Panda  ')
    expect(key).toBe('dunk-low::US 11::Panda')
  })
})
