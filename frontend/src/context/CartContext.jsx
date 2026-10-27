import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

/**
 * Storage version key: Stores strictly minimal variant descriptors:
 * [ { productId, size, colorway, qty } ]
 * NO price is stored in client localStorage (comes from server).
 */
const CART_STORAGE_KEY = 'devshop_cart_items_v3'

export const createVariantKey = (productId, size, colorway) => {
  const p = String(productId || '').trim()
  const s = String(size || 'US 9.5').trim()
  const c = String(colorway || 'Standard').trim()
  return `${p}::${s}::${c}`
}

export const DEFAULT_SAMPLE_ITEMS = [
  {
    productId: 'jordan-6-eastside',
    size: 'US 9.5',
    colorway: 'Eastside Golf Neutral',
    qty: 1,
  },
  {
    productId: 'snowboard-liquid',
    size: '158cm',
    colorway: 'Crimson Edition',
    qty: 1,
  },
]

export const DEFAULT_CART_ITEMS = []

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // rawItems contains ONLY: [ { productId, size, colorway, qty } ]
  const [rawItems, setRawItems] = useState(() => {
    try {
      // Clean up legacy storage keys that saved client prices or mock defaults
      localStorage.removeItem('devshop_cart_items_v1')
      localStorage.removeItem('devshop_cart_items_v2')

      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored !== null) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.map((it) => ({
            productId: it.productId || it.id,
            size: it.size || 'US 9.5',
            colorway: it.colorway || 'Standard',
            qty: Math.max(1, parseInt(it.qty || it.quantity || 1, 10)),
          }))
        }
      }
    } catch (err) {
      console.error('Error loading cart descriptors from localStorage:', err)
    }
    return []
  })

  // Hydrated items with authoritative prices fetched from server
  const [hydratedItems, setHydratedItems] = useState([])
  const [serverTotals, setServerTotals] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  })
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Sync strictly minimal descriptors { productId, size, colorway, qty } to localStorage
  useEffect(() => {
    try {
      const minimal = rawItems.map((it) => ({
        productId: it.productId,
        size: it.size,
        colorway: it.colorway,
        qty: it.qty,
      }))
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(minimal))
    } catch (err) {
      console.error('Error saving cart to localStorage:', err)
    }
  }, [rawItems])

  // Sync with backend API to fetch authoritative server prices & metadata
  const syncWithServer = useCallback(async (itemsToPrice) => {
    if (!itemsToPrice || itemsToPrice.length === 0) {
      setHydratedItems([])
      setServerTotals({ subtotal: 0, tax: 0, shipping: 0, total: 0 })
      return
    }

    setIsLoadingPrices(true)
    try {
      const result = await api.priceCart(itemsToPrice)
      if (result && Array.isArray(result.items)) {
        setHydratedItems(result.items)
        setServerTotals({
          subtotal: result.subtotal || 0,
          tax: result.tax || 0,
          shipping: result.shipping || 0,
          total: result.total || 0,
        })
      }
    } catch (err) {
      console.error('Failed to sync authoritative prices from server:', err)
    } finally {
      setIsLoadingPrices(false)
    }
  }, [])

  // Re-sync with server whenever rawItems changes
  useEffect(() => {
    syncWithServer(rawItems)
  }, [rawItems, syncWithServer])

  const totalItemCount = rawItems.reduce((sum, it) => sum + (it.qty || 1), 0)

  // Subtotal is dynamically derived from authoritative server pricing
  const subtotal = serverTotals.subtotal > 0
    ? serverTotals.subtotal
    : Number(hydratedItems.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0).toFixed(2))

  /**
   * addToCart:
   * Checks BOTH size AND colorway when determining if item already exists.
   * If same product has different colorway or size, it is added as a separate line item.
   */
  const addToCart = (product, options = {}) => {
    const productId = product.productId || product.id
    if (!productId) return

    const targetSize = String(options.size || product.size || 'US 9.5').trim()
    const targetColor = String(options.colorway || product.colorway || 'Standard').trim()
    const quantityToAdd = Math.max(1, parseInt(options.quantity || options.qty || 1, 10))

    setRawItems((prev) => {
      // Find matching item by BOTH size AND colorway
      const existingIndex = prev.findIndex(
        (it) =>
          it.productId === productId &&
          String(it.size || '').trim().toLowerCase() === targetSize.toLowerCase() &&
          String(it.colorway || '').trim().toLowerCase() === targetColor.toLowerCase()
      )

      if (existingIndex > -1) {
        // Increment quantity of this exact variant
        const updated = [...prev]
        const existing = updated[existingIndex]
        updated[existingIndex] = {
          ...existing,
          qty: (existing.qty || 1) + quantityToAdd,
        }
        return updated
      }

      // Add as distinct variant line item
      return [
        ...prev,
        {
          productId,
          size: targetSize,
          colorway: targetColor,
          qty: quantityToAdd,
        },
      ]
    })
  }

  /**
   * removeFromCart:
   * Removes ONLY the specific variant line item.
   * Does NOT remove other colorways or sizes of the same product.
   */
  const removeFromCart = (identifier) => {
    setRawItems((prev) => {
      return prev.filter((item) => {
        const itemVariantKey = createVariantKey(item.productId, item.size, item.colorway)

        if (typeof identifier === 'string') {
          // If identifier matches the variant compound key or cartItemId
          if (itemVariantKey === identifier) return false
          // If identifier is exact match
          if (identifier.includes('::') && itemVariantKey === identifier) return false
          // If caller passed cartItemId
          if (identifier === `${item.productId}::${item.size}::${item.colorway}`) return false
        } else if (identifier && typeof identifier === 'object') {
          const targetKey = createVariantKey(
            identifier.productId || identifier.id,
            identifier.size,
            identifier.colorway
          )
          if (itemVariantKey === targetKey) return false
        }

        return true
      })
    })
  }

  /**
   * updateQuantity:
   * Updates quantity of the specific variant line item.
   */
  const updateQuantity = (identifier, newQty) => {
    if (newQty <= 0) {
      removeFromCart(identifier)
      return
    }

    setRawItems((prev) =>
      prev.map((item) => {
        const itemVariantKey = createVariantKey(item.productId, item.size, item.colorway)
        const matches =
          typeof identifier === 'string'
            ? itemVariantKey === identifier || identifier === `${item.productId}::${item.size}::${item.colorway}`
            : identifier && typeof identifier === 'object'
            ? itemVariantKey === createVariantKey(identifier.productId || identifier.id, identifier.size, identifier.colorway)
            : false

        if (matches) {
          return { ...item, qty: newQty }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setRawItems([])
  }

  const resetToSampleCart = () => {
    setRawItems(DEFAULT_SAMPLE_ITEMS)
  }

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev)

  return (
    <CartContext.Provider
      value={{
        items: hydratedItems,
        rawItems,
        cartCount: totalItemCount,
        totalItemCount,
        subtotal,
        tax: serverTotals.tax,
        shippingCost: serverTotals.shipping,
        total: serverTotals.total,
        isLoadingPrices,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        resetToSampleCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
