/**
 * Centralized API Service for Dev Shop Frontend
 * Connects frontend directly to Dev Shop Drop Vault API (backend).
 * All data is fetched exclusively from the backend / database.
 */

// Base URL: In dev, Vite proxies /api to http://localhost:5000/api
// Can also be set via VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Universal JSON fetch helper with error handling & JWT token support
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const token =
    options.token ||
    (typeof window !== 'undefined' ? localStorage.getItem('devshop_jwt_token') : null)

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    credentials: options.credentials || 'include',
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
   * User logout: Revokes JWT session and clears cookies on backend
   */
  async logout() {
    return request('/auth/logout', {
      method: 'POST',
    }).catch(() => ({}))
  },

  /**
   * Fetch products with optional filtering (category, brand, search query)
   */
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.category && params.category !== 'All') queryParams.append('category', params.category)
    if (params.brand && params.brand !== 'All') queryParams.append('brand', params.brand)
    if (params.q) queryParams.append('q', params.q)

    const qs = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const res = await request(`/products${qs}`)
    return res.data || res || []
  },

  /**
   * Fetch single product by ID directly from API
   */
  async getProductById(id) {
    if (!id) return null
    try {
      const res = await request(`/products/${encodeURIComponent(id)}`)
      return res.data || res || null
    } catch (err) {
      if (err.status === 404) {
        return null
      }
      throw err
    }
  },

  /**
   * Fetch deals of the day directly from API
   */
  async getDeals() {
    const res = await request('/products/deals')
    return res.data || res || []
  },

  /**
   * Fetch related products for product details page
   */
  async getRelatedProducts(id) {
    const qs = id ? `?currentId=${encodeURIComponent(id)}` : ''
    const res = await request(`/products/related${qs}`)
    return res.data || res || []
  },

  /**
   * Fetch cross-sell and cart suggestions
   */
  async getCartSuggestions() {
    const res = await request('/products/cart-suggestions')
    return res.data || res || []
  },

  /**
   * Price and hydrate cart line items from server
   * Sends minimal variant descriptors: [{ productId, size, colorway, qty }]
   * Returns authoritative server-calculated prices, totals and item metadata
   */
  async priceCart(items = []) {
    const res = await request('/cart/price', {
      method: 'POST',
      body: JSON.stringify({ items }),
    })
    return res.data || res
  },

  /**
   * Fetch wishlist recommendations
   */
  async getWishlistRecommendations() {
    const res = await request('/products/recommendations')
    return res.data || res || []
  },

  /**
   * Fetch collections
   */
  async getCollections() {
    const res = await request('/collections')
    return res.data || res || []
  },

  /**
   * Fetch featured landing collections
   */
  async getFeaturedLandingCollections() {
    const res = await request('/collections')
    return res.data || res || []
  },

  /**
   * Fetch single collection by ID
   */
  async getCollectionById(id) {
    const res = await request(`/collections/${encodeURIComponent(id)}`)
    return res.data || res
  },

  /**
   * Fetch blog articles
   */
  async getBlogs() {
    const res = await request('/blogs')
    return res.data || res || []
  },

  /**
   * Fetch featured landing blogs
   */
  async getFeaturedBlogs() {
    const res = await request('/blogs')
    return res.data || res || []
  },

  /**
   * Fetch hero drop announcement
   */
  async getHeroDrop() {
    try {
      const res = await request('/drops/hero')
      return res.data || res
    } catch {
      return null
    }
  },

  /**
   * Fetch festival pass
   */
  async getFestivalPass() {
    try {
      const res = await request('/drops/pass')
      return res.data || res
    } catch {
      return null
    }
  },

  /**
   * Fetch FAQ items and categories
   */
  async getFaqs(category) {
    const qs = category && category !== 'all' ? `?category=${category}` : ''
    const res = await request(`/faqs${qs}`)
    return {
      items: res.data || [],
      categories: res.categories || [],
    }
  },

  /**
   * Fetch account recent drop orders
   */
  async getOrders() {
    const res = await request('/orders/my-orders')
    return res.data || res || []
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
   * Create a new order
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
    return request('/wishlist')
  },

  /**
   * Toggle item in wishlist on backend
   */
  async toggleWishlist(productId) {
    return request('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
  },

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(productId) {
    return request(`/wishlist/${productId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Clear all wishlist items
   */
  async clearWishlist() {
    return request('/wishlist', {
      method: 'DELETE',
    })
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
   * Admin: Create / deploy a new streetwear drop
   */
  async createProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  /**
   * Admin: Update drop stock status, stock count, price
   */
  async updateProduct(id, updates) {
    return request(`/products/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  /**
   * Admin: Delete / archive drop from vault
   */
  async deleteProduct(id) {
    return request(`/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },
}

export default api
