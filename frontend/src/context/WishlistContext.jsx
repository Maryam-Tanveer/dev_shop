import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import { INITIAL_WISHLIST_ITEMS } from '../data/wishlist'

const WISHLIST_STORAGE_KEY = 'devshop_wishlist_items_v2'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) return parsed
      }
    } catch (e) {
      console.warn('[Wishlist] Failed to read localStorage:', e)
    }
    return INITIAL_WISHLIST_ITEMS || []
  })

  // Synchronize with backend API on mount
  useEffect(() => {
    let isMounted = true
    api
      .getWishlist()
      .then((res) => {
        if (isMounted && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data)
          try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(res.data))
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('[Wishlist API] Background sync notice:', err.message)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Persist items to localStorage
  const persistItems = (newItems) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems))
    } catch (e) {
      console.warn('[Wishlist] LocalStorage save error:', e)
    }
  }

  // Fast O(1) map for lookup
  const wishlistMap = useMemo(() => {
    const map = {}
    items.forEach((item) => {
      if (item && item.id) {
        map[item.id] = true
      }
    })
    return map
  }, [items])

  const isInWishlist = (productId) => {
    if (!productId) return false
    return !!wishlistMap[productId]
  }

  /**
   * Toggle item in wishlist (accepts either a product object or a productId string)
   */
  const toggleWishlist = async (productOrId) => {
    const productId = typeof productOrId === 'string' ? productOrId : productOrId?.id
    if (!productId) return false

    const isCurrentlyIn = !!wishlistMap[productId]
    let nextItems = []
    let inWishlist = false

    if (isCurrentlyIn) {
      nextItems = items.filter((item) => item.id !== productId)
      inWishlist = false
    } else {
      const productObj =
        typeof productOrId === 'object' && productOrId !== null
          ? productOrId
          : {
              id: productId,
              title: productId.replace(/-/g, ' ').toUpperCase(),
              price: 150.0,
              image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
              stockStatus: 'In Stock',
              inStock: true,
            }

      nextItems = [productObj, ...items]
      inWishlist = true
    }

    setItems(nextItems)
    persistItems(nextItems)

    // Sync to backend asynchronously
    api.toggleWishlist(productId).catch((err) => {
      console.warn('[Wishlist API Sync]:', err.message)
    })

    return inWishlist
  }

  /**
   * Add a product object to wishlist
   */
  const addToWishlist = async (product) => {
    if (!product || !product.id) return false
    if (isInWishlist(product.id)) return false

    const nextItems = [product, ...items]
    setItems(nextItems)
    persistItems(nextItems)

    api.toggleWishlist(product.id).catch(() => {})
    return true
  }

  /**
   * Remove item from wishlist by productId
   */
  const removeFromWishlist = async (productId) => {
    if (!productId) return
    const nextItems = items.filter((item) => item.id !== productId)
    setItems(nextItems)
    persistItems(nextItems)

    api.removeFromWishlist(productId).catch(() => {})
  }

  /**
   * Clear all items in wishlist
   */
  const clearWishlist = async () => {
    setItems([])
    persistItems([])
    api.clearWishlist().catch(() => {})
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistMap,
        wishlistCount: items.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export default WishlistContext
