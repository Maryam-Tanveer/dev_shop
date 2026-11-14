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
   * Fetch products with backend filtering:
   * Supports category, brand, brands, minPrice, maxPrice, size, sizes, sort, and search query (q).
   */
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.category && params.category !== 'All') queryParams.append('category', params.category)
    if (params.brand && params.brand !== 'All') queryParams.append('brand', params.brand)
    if (Array.isArray(params.brands) && params.brands.length > 0) {
      queryParams.append('brands', params.brands.join(','))
    }
    if (params.minPrice !== undefined && params.minPrice !== null && Number(params.minPrice) > 0) {
      queryParams.append('minPrice', params.minPrice)
    }
    if (params.maxPrice !== undefined && params.maxPrice !== null && Number(params.maxPrice) < 1000) {
      queryParams.append('maxPrice', params.maxPrice)
    }
    if (params.size && params.size !== 'All') queryParams.append('size', params.size)
    if (Array.isArray(params.sizes) && params.sizes.length > 0) {
      queryParams.append('sizes', params.sizes.join(','))
    }
    if (params.sort && params.sort !== 'Featured') queryParams.append('sort', params.sort)
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
  async priceCart(items = [], shippingMethod = 'standard') {
    const res = await request('/cart/price', {
      method: 'POST',
      body: JSON.stringify({ items, shippingMethod }),
    })
    return res.data || res
  },

  /**
   * Fetch authenticated user's cart from database
   */
  async getCart() {
    const res = await request('/cart', {
      method: 'GET',
    })
    return res.data || res
  },

  /**
   * Sync user cart items to MongoDB for persistence across devices
   */
  async syncCart(items = [], shippingMethod = 'standard') {
    const res = await request('/cart/sync', {
      method: 'POST',
      body: JSON.stringify({ items, shippingMethod }),
    })
    return res.data || res
  },

  /**
   * Clear user cart from MongoDB
   */
  async clearServerCart() {
    return request('/cart', {
      method: 'DELETE',
    })
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
   * Fetch blog articles with optional category filtering
   */
  async getBlogs(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.category && params.category !== 'all') {
      queryParams.append('category', params.category)
    }
    const qs = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const res = await request(`/blogs${qs}`)
    return res.data || res || []
  },

  /**
   * Fetch single blog article by ID
   */
  async getBlogById(id) {
    if (!id) return null
    try {
      const res = await request(`/blogs/${encodeURIComponent(id)}`)
      return res.data || res || null
    } catch (err) {
      if (err.status === 404) return null
      throw err
    }
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
   * Update an order (Admin only: status, carrier, trackingNumber, estimatedDelivery)
   */
  async updateOrder(id, updateData) {
    return request(`/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
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
   * Subscribe to Newsletter (persists subscriber & dispatches welcome email)
   */
  async subscribeNewsletter(email, source = 'footer_newsletter') {
    return request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
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
