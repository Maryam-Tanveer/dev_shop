/**
 * Centralized API Service for Dev Shop Frontend
 * Connects frontend directly to Dev Shop Drop Vault Express API (backend)
 * Features async fetch() wrappers with fallback to local mock data.
 */

import { ALL_PRODUCTS, getProductById as getLocalProductById } from '../data/products'
import { DEALS_OF_THE_DAY } from '../data/deals'
import { COLLECTIONS_DATA, FEATURED_LANDING_COLLECTIONS } from '../data/collections'
import { BLOG_POSTS, FEATURED_BLOG_POSTS } from '../data/blog'
import { FAQ_DATA, FAQ_CATEGORIES } from '../data/faq'
import { RECENT_DROP_ORDERS } from '../data/orders'
import { RELATED_PRODUCTS } from '../data/related'
import { CROSS_SELL_ITEMS } from '../data/cartSuggestions'
import { WISHLIST_RECOMMENDATIONS } from '../data/wishlist'

// Base URL: In dev, Vite proxies /api to http://localhost:5000/api
// Can also be set via VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Universal JSON fetch helper with error handling & JWT token support
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const token = options.token || (typeof window !== 'undefined' ? localStorage.getItem('devshop_jwt_token') : null)

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const errorMsg = data?.error || `HTTP ${response.status}: ${response.statusText}`
    const error = new Error(errorMsg)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  /**
   * User login with Email and Password
   */
  async login({ email, password }) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  /**
   * User registration with Name, Email and Password
   */
  async register({ name, email, password }) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  },

  /**
   * Verify session & fetch authenticated user profile
   */
  async getMe(token) {
    return request('/auth/me', {
      method: 'GET',
      token,
    })
  },

  /**
   * Google sign in / OAuth authentication (requires verified Google idToken)
   */
  async googleAuth(payload) {
    const body = typeof payload === 'string' ? { idToken: payload } : payload
    return request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },
  /**
   * Fetch products with optional filtering
   */
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.category && params.category !== 'All') queryParams.append('category', params.category)
      if (params.brand && params.brand !== 'All') queryParams.append('brand', params.brand)
      if (params.q) queryParams.append('q', params.q)

      const qs = queryParams.toString() ? `?${queryParams.toString()}` : ''
      const res = await request(`/products${qs}`)
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local products:', err.message)
      let results = [...ALL_PRODUCTS]
      if (params.category && params.category !== 'All') {
        results = results.filter((p) => p.category?.toLowerCase() === params.category.toLowerCase())
      }
      if (params.brand && params.brand !== 'All') {
        results = results.filter((p) => p.brand?.toLowerCase().includes(params.brand.toLowerCase()))
      }
      if (params.q) {
        const q = params.q.toLowerCase()
        results = results.filter((p) => p.title?.toLowerCase().includes(q) || p.fullTitle?.toLowerCase().includes(q))
      }
      return results
    }
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id) {
    if (!id) return null
    try {
      const res = await request(`/products/${encodeURIComponent(id)}`)
      return res.data || res
    } catch (err) {
      if (err.status === 404) {
        return null
      }
      console.warn(`[API Fallback] Falling back to local product for id '${id}':`, err.message)
      return getLocalProductById(id) || null
    }
  },

  /**
   * Fetch deals of the day
   */
  async getDeals() {
    try {
      const res = await request('/products/deals')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local deals:', err.message)
      return DEALS_OF_THE_DAY
    }
  },

  /**
   * Fetch related products for product details page
   */
  async getRelatedProducts(id) {
    try {
      const res = await request('/products/related')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local related products:', err.message)
      return RELATED_PRODUCTS
    }
  },

  /**
   * Fetch cross-sell and cart suggestions
   */
  async getCartSuggestions() {
    try {
      const res = await request('/products/cart-suggestions')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local cart suggestions:', err.message)
      return CROSS_SELL_ITEMS
    }
  },

  /**
   * Price and hydrate cart line items from server
   * Sends minimal variant descriptors: [{ productId, size, colorway, qty }]
   * Returns authoritative server-calculated prices, totals and item metadata
   */
  async priceCart(items = []) {
    try {
      const res = await request('/cart/price', {
        method: 'POST',
        body: JSON.stringify({ items }),
      })
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local cart calculation:', err.message)
      const enrichedItems = (items || []).map((raw) => {
        const prod = getLocalProductById(raw.productId || raw.id) || {}
        const serverPrice = typeof prod.price === 'number' ? prod.price : parseFloat(prod.price) || 0
        const variantKey = `${raw.productId || raw.id}::${raw.size || 'US 9.5'}::${raw.colorway || 'standard'}`
        return {
          cartItemId: variantKey,
          id: variantKey,
          productId: raw.productId || raw.id,
          title: prod.title || 'Product',
          fullTitle: prod.fullTitle || prod.title,
          brand: prod.brand || 'Dev Shop',
          category: prod.category || 'Sneakers',
          colorway: raw.colorway || 'Standard',
          size: raw.size || 'US 9.5',
          quantity: raw.qty || raw.quantity || 1,
          price: serverPrice,
          originalPrice: prod.originalPrice || serverPrice,
          image: prod.image || prod.thumbnails?.[0]?.image || '',
          badge: prod.badge || prod.tag || 'NEW DROP',
          badgeColor: prod.badgeColor || 'bg-neutral-900 text-white',
          condition: prod.condition || 'Deadstock Authentic',
          tag: prod.tag || 'Vault Certified',
          spec: prod.feature1Subtitle || '',
        }
      })
      const subtotal = Number(enrichedItems.reduce((acc, it) => acc + it.price * it.quantity, 0).toFixed(2))
      const tax = subtotal > 0 ? 76.80 : 0
      const shipping = subtotal === 0 || subtotal > 200 ? 0 : 25.00
      const total = Number((subtotal + tax + shipping).toFixed(2))
      return {
        items: enrichedItems,
        subtotal,
        tax,
        shipping,
        total,
        itemCount: enrichedItems.reduce((acc, it) => acc + it.quantity, 0)
      }
    }
  },

  /**
   * Fetch wishlist recommendations
   */
  async getWishlistRecommendations() {
    try {
      const res = await request('/products/recommendations')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local wishlist recommendations:', err.message)
      return WISHLIST_RECOMMENDATIONS
    }
  },

  /**
   * Fetch collections
   */
  async getCollections() {
    try {
      const res = await request('/collections')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local collections:', err.message)
      return COLLECTIONS_DATA
    }
  },

  /**
   * Fetch featured landing collections
   */
  async getFeaturedLandingCollections() {
    try {
      const res = await request('/collections')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to featured landing collections:', err.message)
      return FEATURED_LANDING_COLLECTIONS
    }
  },

  /**
   * Fetch single collection by ID
   */
  async getCollectionById(id) {
    try {
      const res = await request(`/collections/${encodeURIComponent(id)}`)
      return res.data || res
    } catch (err) {
      console.warn(`[API Fallback] Falling back to local collection id '${id}':`, err.message)
      return COLLECTIONS_DATA.find((c) => c.id === id)
    }
  },

  /**
   * Fetch blog articles
   */
  async getBlogs() {
    try {
      const res = await request('/blogs')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local blogs:', err.message)
      return BLOG_POSTS
    }
  },

  /**
   * Fetch featured landing blogs
   */
  async getFeaturedBlogs() {
    try {
      const res = await request('/blogs')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local featured blogs:', err.message)
      return FEATURED_BLOG_POSTS
    }
  },

  /**
   * Fetch hero drop announcement
   */
  async getHeroDrop() {
    try {
      const res = await request('/drops/hero')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to default hero drop:', err.message)
      return {
        id: 'hero-air-jordan-6',
        badge: 'NEW ARRIVAL!',
        name: 'AIR JORDAN 6',
        edition: 'GX EASTSIDE',
        retailPrice: 210,
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      }
    }
  },

  /**
   * Fetch festival pass
   */
  async getFestivalPass() {
    try {
      const res = await request('/drops/pass')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to default festival pass:', err.message)
      return null
    }
  },

  /**
   * Fetch FAQ items and categories
   */
  async getFaqs(category) {
    try {
      const qs = category && category !== 'all' ? `?category=${category}` : ''
      const res = await request(`/faqs${qs}`)
      return {
        items: res.data || [],
        categories: res.categories || FAQ_CATEGORIES,
      }
    } catch (err) {
      console.warn('[API Fallback] Falling back to local FAQs:', err.message)
      const items = category && category !== 'all' ? FAQ_DATA.filter((i) => i.category === category) : FAQ_DATA
      return { items, categories: FAQ_CATEGORIES }
    }
  },

  /**
   * Fetch account recent drop orders
   */
  async getOrders() {
    try {
      const res = await request('/orders/my-orders')
      return res.data || res
    } catch (err) {
      console.warn('[API Fallback] Falling back to local orders:', err.message)
      return RECENT_DROP_ORDERS
    }
  },

  /**
   * Fetch all system orders (Administrator only)
   */
  async getAllOrders() {
    return request('/orders')
  },

  /**
   * Fetch specific order details by ID
   */
  async getOrderById(id) {
    return request(`/orders/${id}`)
  },

  /**
   * Create a new order and trigger invoice email receipt dispatch
   */
  async createOrder(orderData) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  /**
   * Create Stripe Checkout Session (PCI-DSS compliant hosted checkout)
   */
  async createCheckoutSession(checkoutData) {
    return request('/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    })
  },

  /**
   * Verify completed Stripe checkout session
   */
  async verifyPaymentSession(sessionId) {
    return request(`/payments/verify-session/${sessionId}`)
  },

  /**
   * Subscribe to VIP drop alerts (triggers notification email)
   */
  async subscribeDropAlert(email, dropTitle) {
    return request('/drops/subscribe-alert', {
      method: 'POST',
      body: JSON.stringify({ email, dropTitle }),
    })
  },

  /**
   * Fetch current wishlist items and IDs from backend
   */
  async getWishlist() {
    try {
      const res = await request('/wishlist')
      return res
    } catch (err) {
      console.warn('[API Fallback] Wishlist fetch error:', err.message)
      return { success: false, data: [], ids: [] }
    }
  },

  /**
   * Toggle item in wishlist on backend
   */
  async toggleWishlist(productId) {
    try {
      const res = await request('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      })
      return res
    } catch (err) {
      console.warn('[API Fallback] Wishlist toggle error:', err.message)
      return { success: false }
    }
  },

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(productId) {
    try {
      const res = await request(`/wishlist/${productId}`, {
        method: 'DELETE',
      })
      return res
    } catch (err) {
      console.warn('[API Fallback] Wishlist remove error:', err.message)
      return { success: false }
    }
  },

  /**
   * Clear all wishlist items
   */
  async clearWishlist() {
    try {
      const res = await request('/wishlist', {
        method: 'DELETE',
      })
      return res
    } catch (err) {
      console.warn('[API Fallback] Wishlist clear error:', err.message)
      return { success: false }
    }
  },

  /**
   * Get user profile details & addresses
   */
  async getProfile() {
    return request('/user/profile')
  },

  /**
   * Update user profile (name, avatar, phone, bio)
   */
  async updateProfile(profileData) {
    return request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  },

  /**
   * Change user password
   */
  async changePassword(passwordData) {
    return request('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    })
  },

  /**
   * Get all user shipping addresses
   */
  async getAddresses() {
    return request('/user/addresses')
  },

  /**
   * Add a new shipping address
   */
  async addAddress(addressData) {
    return request('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    })
  },

  /**
   * Update an existing address
   */
  async updateAddress(addressId, addressData) {
    return request(`/user/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    })
  },

  /**
   * Delete an existing address
   */
  async deleteAddress(addressId) {
    return request(`/user/addresses/${addressId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Admin: Create / deploy a new streetwear drop (Requires JWT admin authentication)
   */
  async createProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  /**
   * Admin: Update drop stock status, stock count, price (Requires JWT admin authentication)
   */
  async updateProduct(id, updates) {
    return request(`/products/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  /**
   * Admin: Delete / archive drop from vault (Requires JWT admin authentication)
   */
  async deleteProduct(id) {
    return request(`/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },
}

export default api
