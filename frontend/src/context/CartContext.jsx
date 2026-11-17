import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { useAuth } from './AuthContext'

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
  const { isAuthenticated, currentUser } = useAuth()

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
  const [pricingError, setPricingError] = useState(null)
  const [serverTotals, setServerTotals] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    shippingCost: 0,
    shippingMethod: 'standard',
    total: 0,
    freeShippingThreshold: 150,
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

  // Pull remote cart from database when authenticated
  useEffect(() => {
    let isMounted = true
    if (isAuthenticated) {
      api
        .getCart()
        .then((res) => {
          if (!isMounted) return
          const remoteRaw = res?.data?.rawItems || res?.rawItems
          if (Array.isArray(remoteRaw) && remoteRaw.length > 0) {
            setRawItems((local) => {
              if (!local || local.length === 0) return remoteRaw

              const map = new Map()
              for (const it of remoteRaw) {
                const k = createVariantKey(it.productId, it.size, it.colorway)
                map.set(k, { ...it })
              }
              for (const it of local) {
                const k = createVariantKey(it.productId, it.size, it.colorway)
                if (map.has(k)) {
                  map.get(k).qty = Math.max(map.get(k).qty, it.qty)
                } else {
                  map.set(k, { ...it })
                }
              }
              return Array.from(map.values())
            })
          }
        })
        .catch((err) => {
          console.warn('[Cart Sync Notice]:', err.message)
        })
    }

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, currentUser?.id])

  // Sync with backend API to fetch authoritative server prices & metadata (and persist to DB if authenticated)
  const syncWithServer = useCallback(async (itemsToPrice) => {
    if (!itemsToPrice || itemsToPrice.length === 0) {
      setHydratedItems([])
      setServerTotals({
        subtotal: 0,
        tax: 0,
        shipping: 0,
        shippingCost: 0,
        shippingMethod: 'standard',
        total: 0,
        freeShippingThreshold: 150,
      })
      setPricingError(null)
      return
    }

    setIsLoadingPrices(true)
    setPricingError(null)
    try {
      const result = isAuthenticated
        ? await api.syncCart(itemsToPrice)
        : await api.priceCart(itemsToPrice)

      if (result && Array.isArray(result.items) && result.items.length > 0) {
        setHydratedItems(result.items)
        setServerTotals({
          subtotal: result.subtotal || 0,
          tax: result.tax || 0,
          shipping: result.shipping ?? result.shippingCost ?? 0,
          shippingCost: result.shippingCost ?? result.shipping ?? 0,
          shippingMethod: result.shippingMethod || 'standard',
          total: result.total || result.totalAmount || 0,
          freeShippingThreshold: result.freeShippingThreshold ?? 150,
        })
        setPricingError(null)
      } else {
        setHydratedItems([])
        setServerTotals({
          subtotal: 0,
          tax: 0,
          shipping: 0,
          shippingCost: 0,
          shippingMethod: 'standard',
          total: 0,
          freeShippingThreshold: 150,
        })
        setPricingError('Prices load nahi huin')
      }
    } catch (err) {
      console.warn('Server cart pricing unavailable:', err.message)
      setHydratedItems([])
      setServerTotals({
        subtotal: 0,
        tax: 0,
        shipping: 0,
        shippingCost: 0,
        shippingMethod: 'standard',
        total: 0,
        freeShippingThreshold: 150,
      })
      setPricingError('Prices load nahi huin')
    } finally {
      setIsLoadingPrices(false)
    }
  }, [isAuthenticated])

  // Re-sync with server whenever rawItems changes
  useEffect(() => {
    syncWithServer(rawItems)
  }, [rawItems, syncWithServer])

  const totalItemCount = rawItems.reduce((sum, it) => sum + (it.qty || 1), 0)

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
    const itemTitle = product.title || product.fullTitle || 'Vault Drop Item'
    const itemPrice = Number(product.price) || 0
    const itemImage = product.image || product.thumbnails?.[0]?.image || ''

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
          title: itemTitle,
          price: itemPrice,
          image: itemImage || existing.image,
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
          title: itemTitle,
          price: itemPrice,
          image: itemImage,
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
          if (itemVariantKey === identifier) return false
          if (item.productId === identifier) return false
          if (item.id === identifier) return false
          if (item.cartItemId === identifier) return false
          if (identifier.includes('::') && itemVariantKey === identifier) return false
          if (identifier === `${item.productId}::${item.size}::${item.colorway}`) return false
        } else if (identifier && typeof identifier === 'object') {
          const targetKey = createVariantKey(
            identifier.productId || identifier.id,
            identifier.size,
            identifier.colorway
          )
          if (itemVariantKey === targetKey) return false
          if ((identifier.productId || identifier.id) === item.productId && (!identifier.size || identifier.size === item.size)) return false
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
            ? itemVariantKey === identifier ||
              identifier === `${item.productId}::${item.size}::${item.colorway}` ||
              item.productId === identifier ||
              item.id === identifier ||
              item.cartItemId === identifier
            : identifier && typeof identifier === 'object'
            ? itemVariantKey === createVariantKey(identifier.productId || identifier.id, identifier.size, identifier.colorway) ||
              ((identifier.productId || identifier.id) === item.productId && (!identifier.size || identifier.size === item.size))
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
    setHydratedItems([])
    if (isAuthenticated) {
      api.clearServerCart().catch(() => {})
    }
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
        serverTotals,
        subtotal: serverTotals.subtotal,
        tax: serverTotals.tax,
        shippingCost: serverTotals.shippingCost,
        shipping: serverTotals.shippingCost,
        total: serverTotals.total,
        totalAmount: serverTotals.total,
        freeShippingThreshold: serverTotals.freeShippingThreshold || 150,
        pricingError,
        retryPricing: () => syncWithServer(rawItems),
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
    return {
      items: [],
      rawItems: [],
      cartCount: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      openDrawer: () => {},
      closeDrawer: () => {},
      toggleDrawer: () => {},
      isDrawerOpen: false,
    }
  }
  return context
}
