export const TAX_RATE = 0.08
export const PRIORITY_SHIPPING_COST = 25.0
export const STANDARD_SHIPPING_COST = 0.0
export const FREE_SHIPPING_THRESHOLD = 150.0

/**
 * Calculates authoritative subtotal, tax, shippingCost, and totalAmount.
 * Used consistently across cart, orders, and Stripe checkout sessions.
 */
export const calcTotals = (subtotal = 0, shippingMethod = 'standard') => {
  const sub = Number(Number(subtotal || 0).toFixed(2))
  const isPriority = String(shippingMethod || '').toLowerCase() === 'priority'
  const shippingCost = isPriority ? PRIORITY_SHIPPING_COST : STANDARD_SHIPPING_COST
  const tax = Number((sub * TAX_RATE).toFixed(2))
  const totalAmount = Number((sub + shippingCost + tax).toFixed(2))

  return {
    subtotal: sub,
    shippingMethod: isPriority ? 'priority' : 'standard',
    shippingCost,
    shipping: shippingCost,
    tax,
    total: totalAmount,
    totalAmount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  }
}

