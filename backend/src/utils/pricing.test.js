import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { calcTotals, TAX_RATE, PRIORITY_SHIPPING_COST, STANDARD_SHIPPING_COST } from './pricing.js'

describe('Centralized Pricing Calculator', () => {
  it('calculates standard shipping (free) with correct tax', () => {
    const subtotal = 100
    const result = calcTotals(subtotal, 'standard')

    assert.equal(result.subtotal, 100)
    assert.equal(result.shippingCost, STANDARD_SHIPPING_COST)
    assert.equal(result.tax, 8.0) // 8% of 100
    assert.equal(result.totalAmount, 108.0)
    assert.equal(result.shippingMethod, 'standard')
  })

  it('calculates priority insured shipping correctly', () => {
    const subtotal = 200
    const result = calcTotals(subtotal, 'priority')

    assert.equal(result.subtotal, 200)
    assert.equal(result.shippingCost, PRIORITY_SHIPPING_COST)
    assert.equal(result.tax, 16.0)
    assert.equal(result.totalAmount, 200 + 25 + 16)
    assert.equal(result.shippingMethod, 'priority')
  })

  it('handles fractional currency rounding with precision', () => {
    const subtotal = 749.95
    const result = calcTotals(subtotal, 'priority')

    const expectedTax = Number((749.95 * TAX_RATE).toFixed(2)) // 59.996 -> 60.00
    assert.equal(result.tax, expectedTax)
    assert.equal(result.totalAmount, Number((749.95 + 25 + expectedTax).toFixed(2)))
  })

  it('handles zero or negative subtotal safely', () => {
    const result = calcTotals(0, 'standard')
    assert.equal(result.subtotal, 0)
    assert.equal(result.tax, 0)
    assert.equal(result.totalAmount, 0)
  })
})
