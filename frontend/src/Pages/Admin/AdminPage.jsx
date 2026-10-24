import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const DEFAULT_SECRET_KEY = 'DEV_VAULT_ADMIN_2026'

const PRESET_IMAGES = [
  {
    name: 'Travis Scott Jordan 1',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cyberpunk Runner',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Off-White Minimalist',
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Fear of God Boot',
    url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
  },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { items, removeFromCart } = useCart()

  // Admin access state
  const [adminKey, setAdminKey] = useState(() => {
    return localStorage.getItem('devshop_admin_key') || ''
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('devshop_admin_key') === DEFAULT_SECRET_KEY || currentUser?.role === 'admin'
  })
  const [passcodeInput, setPasscodeInput] = useState('')
  const [passcodeError, setPasscodeError] = useState('')

  // Inventory state
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [toast, setToast] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Deploy Drop Modal
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newDrop, setNewDrop] = useState({
    title: '',
    brand: 'Air Jordan',
    category: 'Sneakers',
    price: '',
    originalPrice: '',
    stockStatus: 'In Stock',
    stock: 20,
    badge: 'NEW DROP',
    image: PRESET_IMAGES[0].url,
    description: '',
  })

  // Quick edit stock state: map of productId -> number
  const [stockEdits, setStockEdits] = useState({})
  const [isDragging, setIsDragging] = useState(false)

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setNewDrop((prev) => ({ ...prev, image: e.target.result }))
      showToast('Image loaded from desktop!')
    }
    reader.readAsDataURL(file)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Load drops from API
  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await api.getProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      showToast(`Error fetching catalog: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  // Handle Passcode Unlock
  const handleUnlock = (e) => {
    e?.preventDefault()
    if (passcodeInput.trim() === DEFAULT_SECRET_KEY || passcodeInput.trim().toUpperCase() === 'ADMIN') {
      localStorage.setItem('devshop_admin_key', DEFAULT_SECRET_KEY)
      setAdminKey(DEFAULT_SECRET_KEY)
      setIsAuthenticated(true)
      setPasscodeError('')
      showToast('Vault Command Console Unlocked!')
    } else {
      setPasscodeError('Invalid Admin Passcode. Use DEV_VAULT_ADMIN_2026')
    }
  }

  const handleLogoutAdmin = () => {
    localStorage.removeItem('devshop_admin_key')
    setAdminKey('')
    setIsAuthenticated(false)
    showToast('Vault Command Console Locked.')
  }

  // Update Stock Status
  const handleUpdateStatus = async (productId, newStatus, currentStock) => {
    try {
      let nextStock = currentStock
      if (newStatus === 'Sold Out') nextStock = 0
      else if (newStatus === 'Low Stock' && currentStock > 3) nextStock = 2
      else if (newStatus === 'In Stock' && currentStock === 0) nextStock = 15

      await api.updateProduct(productId, {
        stockStatus: newStatus,
        stock: nextStock,
        isUnavailable: newStatus === 'Sold Out' || newStatus === 'TBA',
      }, adminKey)

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stockStatus: newStatus, stock: nextStock } : p
        )
      )
      showToast(`Updated '${productId}' status to ${newStatus}`)
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`)
    }
  }

  // Save Inline Stock Count
  const handleSaveStockCount = async (productId) => {
    const newCount = Number(stockEdits[productId])
    if (isNaN(newCount) || newCount < 0) {
      showToast('Please enter a valid non-negative number')
      return
    }

    try {
      const newStatus = newCount === 0 ? 'Sold Out' : newCount <= 3 ? 'Low Stock' : 'In Stock'
      await api.updateProduct(productId, {
        stock: newCount,
        stockStatus: newStatus,
        isUnavailable: newCount === 0,
      }, adminKey)

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stock: newCount, stockStatus: newStatus } : p
        )
      )
      showToast(`Stock count for '${productId}' updated to ${newCount}`)
    } catch (err) {
      showToast(`Failed to update stock: ${err.message}`)
    }
  }

  // Delete / Archive Drop
  const handleDeleteDrop = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to remove drop "${title}" from the Vault?`)) {
      return
    }

    try {
      await api.deleteProduct(productId, adminKey)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      showToast(`Drop "${title}" removed from vault.`)
    } catch (err) {
      showToast(`Failed to delete drop: ${err.message}`)
    }
  }

  // Deploy New Drop Submit
  const handleDeployDrop = async (e) => {
    e.preventDefault()
    if (!newDrop.title || !newDrop.price || !newDrop.image) {
      showToast('Title, Price, and Image are required!')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title: newDrop.title.trim(),
        brand: newDrop.brand.trim() || 'Dev Shop Vault',
        category: newDrop.category,
        price: Number(newDrop.price),
        originalPrice: newDrop.originalPrice ? Number(newDrop.originalPrice) : null,
        stockStatus: newDrop.stockStatus,
        stock: Number(newDrop.stock) || 15,
        badge: newDrop.badge || 'NEW DROP',
        image: newDrop.image.trim(),
        description: newDrop.description.trim() || undefined,
      }

      const res = await api.createProduct(payload, adminKey)
      if (res.data) {
        setProducts((prev) => [res.data, ...prev])
      } else {
        await loadProducts()
      }

      setIsDeployModalOpen(false)
      setNewDrop({
        title: '',
        brand: 'Air Jordan',
        category: 'Sneakers',
        price: '',
        originalPrice: '',
        stockStatus: 'In Stock',
        stock: 20,
        badge: 'NEW DROP',
        image: PRESET_IMAGES[0].url,
        description: '',
      })
      showToast(`🚀 Drop '${payload.title}' successfully deployed to live catalog!`)
    } catch (err) {
      showToast(`Deployment error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase()

    const matchesStatus =
      selectedStatus === 'All' ||
      p.stockStatus?.toLowerCase() === selectedStatus.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Overview metrics
  const totalDrops = products.length
  const inStockCount = products.filter((p) => p.stockStatus === 'In Stock').length
  const lowStockCount = products.filter((p) => p.stockStatus === 'Low Stock' || (p.stock > 0 && p.stock <= 3)).length
  const soldOutCount = products.filter((p) => p.stockStatus === 'Sold Out' || p.stock === 0).length
  const avgPrice = totalDrops > 0 ? (products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalDrops).toFixed(0) : 0

  return (
    <div className="min-h-screen bg-[#0e0e11] text-neutral-100 flex flex-col font-sans relative selection:bg-[#c81d25] selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a24] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#c81d25]/50 text-xs font-semibold animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#c81d25] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={items}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsDrawerOpen(false)
          navigate('/checkout')
        }}
      />

      <Navbar onOpenCart={() => setIsDrawerOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          /* ================= SECRET GATEKEEPER PASSCODE SCREEN ================= */
          <div className="max-w-md mx-auto my-16 bg-[#16161f] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden backdrop-blur-xl">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c81d25]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#c81d25] to-neutral-900 flex items-center justify-center text-2xl shadow-xl shadow-[#c81d25]/20">
              🔒
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-[#c81d25]/20 border border-[#c81d25]/40 text-[#ff4d5a] text-[10px] font-mono tracking-widest uppercase mb-3">
              RESTRICTED VAULT ACCESS
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white uppercase mb-2">
              Drop Manager Console
            </h1>
            <p className="text-xs text-neutral-400 mb-8 leading-relaxed">
              Authenticate with your Admin Passkey to deploy new high-heat streetwear allocations and toggle live stock telemetry.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Vault Admin Key"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-3.5 text-sm text-center font-mono tracking-widest text-white placeholder-neutral-600 focus:outline-none transition"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-[11px] text-red-400 mt-2 font-medium">{passcodeError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#c81d25] hover:bg-[#a5151c] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition text-xs tracking-wider uppercase shadow-lg shadow-[#c81d25]/25"
              >
                Authenticate & Unlock
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasscodeInput(DEFAULT_SECRET_KEY)
                  localStorage.setItem('devshop_admin_key', DEFAULT_SECRET_KEY)
                  setAdminKey(DEFAULT_SECRET_KEY)
                  setIsAuthenticated(true)
                  showToast('Authenticated using Master Passcode')
                }}
                className="w-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-[11px] font-mono py-2.5 rounded-xl transition border border-white/5"
              >
                ⚡ Quick Unlock (DEV_VAULT_ADMIN_2026)
              </button>
            </form>
          </div>
        ) : (
          /* ================= AUTHENTICATED DROP MANAGER CONSOLE ================= */
          <div className="space-y-8">
            {/* Header with Title and Deploy Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
                    VAULT COMMAND ONLINE // TIER-0 PRIVILEGES
                  </span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
                  Streetwear Drops & Stock Manager
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage high-heat deadstock allocations, stock availability, and deploy new archive releases.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDeployModalOpen(true)}
                  className="bg-[#c81d25] hover:bg-[#a5151c] text-white text-xs font-bold px-5 py-3 rounded-xl transition tracking-wider uppercase shadow-lg shadow-[#c81d25]/30 flex items-center gap-2"
                >
                  <span className="text-base leading-none">+</span> Deploy New Drop
                </button>
                <button
                  onClick={handleLogoutAdmin}
                  className="bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl border border-white/10 transition"
                  title="Lock Admin Console"
                >
                  🔒 Lock Console
                </button>
              </div>
            </div>

            {/* Metrics Dashboard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-[#16161f] border border-white/10 rounded-2xl p-4">
                <div className="text-[11px] font-mono text-neutral-400 uppercase">Total Drops</div>
                <div className="text-2xl font-black text-white mt-1">{totalDrops}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Catalog allocations</div>
              </div>

              <div className="bg-[#16161f] border border-emerald-500/20 rounded-2xl p-4">
                <div className="text-[11px] font-mono text-emerald-400 uppercase">In Stock</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{inStockCount}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Ready for checkout</div>
              </div>

              <div className="bg-[#16161f] border border-amber-500/20 rounded-2xl p-4">
                <div className="text-[11px] font-mono text-amber-400 uppercase">Low Stock (FOMO)</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{lowStockCount}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">3 or fewer left</div>
              </div>

              <div className="bg-[#16161f] border border-red-500/20 rounded-2xl p-4">
                <div className="text-[11px] font-mono text-red-400 uppercase">Sold Out</div>
                <div className="text-2xl font-black text-red-400 mt-1">{soldOutCount}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Archive status</div>
              </div>

              <div className="bg-[#16161f] border border-white/10 rounded-2xl p-4 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-mono text-neutral-400 uppercase">Avg Allocation</div>
                <div className="text-2xl font-black text-white mt-1">${avgPrice}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Per drop piece</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-[#16161f] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search by title, brand, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status and Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-neutral-500 text-[11px] uppercase font-mono">Status:</span>
                  {['All', 'In Stock', 'Low Stock', 'Sold Out'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedStatus === st
                          ? 'bg-[#c81d25] text-white'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-neutral-500 text-[11px] uppercase font-mono">Category:</span>
                  {['All', 'Sneakers', 'Apparel', 'Outerwear'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedCategory === cat
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drops Table */}
            <div className="bg-[#16161f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {loading ? (
                <div className="py-20 text-center text-neutral-500 font-mono text-xs">
                  <div className="w-8 h-8 border-2 border-[#c81d25] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  SYNCING VAULT TELEMETRY...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center text-neutral-400">
                  <p className="text-sm font-semibold">No streetwear drops found matching filter.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('All')
                      setSelectedStatus('All')
                    }}
                    className="mt-3 text-xs text-[#c81d25] hover:underline"
                  >
                    Clear active filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111118] text-neutral-400 font-mono text-[10px] uppercase border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">Streetwear Drop</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Stock Status Switcher</th>
                        <th className="py-3.5 px-4 text-center">Remaining Stock</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProducts.map((p) => {
                        const currentCount = p.stock !== undefined ? p.stock : 15
                        const editValue = stockEdits[p.id] !== undefined ? stockEdits[p.id] : currentCount

                        return (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition">
                            {/* Product Info */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image || p.thumbnails?.[0]?.image || PRESET_IMAGES[0].url}
                                  alt={p.title}
                                  className="w-12 h-12 rounded-xl object-cover bg-neutral-900 border border-white/10 flex-shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-white text-sm hover:text-[#c81d25] transition">
                                    <Link to={`/product/${p.id}`} target="_blank" rel="noopener noreferrer">
                                      {p.title}
                                    </Link>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                                    <span className="font-mono text-neutral-500">{p.brand}</span>
                                    <span>•</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">
                                      {p.category}
                                    </span>
                                    {p.badge && (
                                      <span className="bg-[#c81d25]/20 text-[#ff4d5a] border border-[#c81d25]/30 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase">
                                        {p.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-4 px-4">
                              <div className="font-mono font-bold text-white text-sm">
                                ${Number(p.price).toFixed(2)}
                              </div>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <div className="text-[10px] text-neutral-500 line-through font-mono">
                                  ${Number(p.originalPrice).toFixed(2)}
                                </div>
                              )}
                            </td>

                            {/* Stock Status Switcher Pills */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(p.id, 'In Stock', currentCount)}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition ${
                                    p.stockStatus === 'In Stock'
                                      ? 'bg-emerald-500 text-black font-bold shadow-sm'
                                      : 'bg-white/5 text-neutral-400 hover:text-emerald-400'
                                  }`}
                                >
                                  In Stock
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(p.id, 'Low Stock', currentCount)}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition ${
                                    p.stockStatus === 'Low Stock'
                                      ? 'bg-amber-500 text-black font-bold shadow-sm'
                                      : 'bg-white/5 text-neutral-400 hover:text-amber-400'
                                  }`}
                                >
                                  Low Stock
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(p.id, 'Sold Out', currentCount)}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition ${
                                    p.stockStatus === 'Sold Out'
                                      ? 'bg-red-500 text-white font-bold shadow-sm'
                                      : 'bg-white/5 text-neutral-400 hover:text-red-400'
                                  }`}
                                >
                                  Sold Out
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(p.id, 'TBA', currentCount)}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition ${
                                    p.stockStatus === 'TBA'
                                      ? 'bg-purple-600 text-white font-bold shadow-sm'
                                      : 'bg-white/5 text-neutral-400 hover:text-purple-400'
                                  }`}
                                >
                                  TBA
                                </button>
                              </div>
                            </td>

                            {/* Stock Count Inline Editor */}
                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex items-center gap-1.5 bg-[#0e0e14] border border-white/10 rounded-xl px-2 py-1">
                                <input
                                  type="number"
                                  min="0"
                                  value={editValue}
                                  onChange={(e) =>
                                    setStockEdits({
                                      ...stockEdits,
                                      [p.id]: e.target.value,
                                    })
                                  }
                                  className="w-14 bg-transparent text-center font-mono text-xs font-bold text-white focus:outline-none"
                                />
                                {stockEdits[p.id] !== undefined && Number(stockEdits[p.id]) !== currentCount && (
                                  <button
                                    onClick={() => handleSaveStockCount(p.id)}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-bold px-2 py-1 rounded transition"
                                    title="Save count"
                                  >
                                    ✓ Save
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to={`/product/${p.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition"
                                  title="Inspect drop live in storefront"
                                >
                                  Live ↗
                                </Link>
                                <button
                                  onClick={() => handleDeleteDrop(p.id, p.title)}
                                  className="text-[11px] text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition"
                                  title="Archive drop from vault"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ================= DEPLOY NEW DROP MODAL ================= */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#16161f] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="text-[10px] font-mono text-[#ff4d5a] uppercase tracking-widest">
                  VAULT AIRDROP PROTOCOL
                </div>
                <h2 className="text-xl font-black text-white uppercase mt-0.5">
                  Deploy Streetwear Drop
                </h2>
              </div>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-neutral-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleDeployDrop} className="mt-6 space-y-4 text-xs">
              {/* Title & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                    Drop Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Travis Scott Jordan 1 Velvet"
                    value={newDrop.title}
                    onChange={(e) => setNewDrop({ ...newDrop, title: e.target.value })}
                    className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Air Jordan, Nike, Yeezy"
                    value={newDrop.brand}
                    onChange={(e) => setNewDrop({ ...newDrop, brand: e.target.value })}
                    className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newDrop.category}
                    onChange={(e) => setNewDrop({ ...newDrop, category: e.target.value })}
                    className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white focus:outline-none transition"
                  >
                    <option value="Sneakers">Sneakers</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                    Drop Badge
                  </label>
                  <select
                    value={newDrop.badge}
                    onChange={(e) => setNewDrop({ ...newDrop, badge: e.target.value })}
                    className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white focus:outline-none transition"
                  >
                    <option value="NEW DROP">NEW DROP</option>
                    <option value="VIP EXCLUSIVE">VIP EXCLUSIVE</option>
                    <option value="LIMITED ARCHIVE">LIMITED ARCHIVE</option>
                    <option value="HIGH HEAT">HIGH HEAT</option>
                    <option value="DEADSTOCK">DEADSTOCK</option>
                  </select>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                    Drop Retail Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 280"
                    value={newDrop.price}
                    onChange={(e) => setNewDrop({ ...newDrop, price: e.target.value })}
                    className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                    Secondary Market / Original ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 420 (shows discount)"
                    value={newDrop.originalPrice}
                    onChange={(e) => setNewDrop({ ...newDrop, originalPrice: e.target.value })}
                    className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Stock Status & Initial Stock Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newDrop.stock}
                    onChange={(e) => setNewDrop({ ...newDrop, stock: e.target.value })}
                    className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white focus:outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                    Status Telemetry
                  </label>
                  <select
                    value={newDrop.stockStatus}
                    onChange={(e) => setNewDrop({ ...newDrop, stockStatus: e.target.value })}
                    className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white focus:outline-none transition"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="TBA">TBA (Upcoming)</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Desktop File Upload */}
              <div className="space-y-3">
                <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                  Streetwear Visual (Upload File or Enter URL) *
                </label>

                {/* Input + Preview row */}
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      placeholder="Paste image URL or drag & drop file below..."
                      value={newDrop.image}
                      onChange={(e) => setNewDrop({ ...newDrop, image: e.target.value })}
                      className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition font-mono text-xs"
                    />
                  </div>
                  {newDrop.image && (
                    <img
                      src={newDrop.image}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-white/20 bg-neutral-900 flex-shrink-0 shadow-md"
                    />
                  )}
                </div>

                {/* Drag & Drop File Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    const file = e.dataTransfer.files[0]
                    if (file) handleImageFile(file)
                  }}
                  onClick={() => document.getElementById('drop-image-file-input')?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                    isDragging
                      ? 'border-[#c81d25] bg-[#c81d25]/15'
                      : 'border-white/10 hover:border-white/25 bg-[#0e0e14]/50'
                  }`}
                >
                  <input
                    type="file"
                    id="drop-image-file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageFile(file)
                    }}
                  />
                  <div className="text-xs text-neutral-300 font-bold flex items-center justify-center gap-1.5">
                    <span>📁</span>
                    <span>Upload image from computer (Drag & drop or click)</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                    Instant preview • Supports PNG, JPG, WEBP, AVIF
                  </div>
                </div>

                {/* Preset Image Selectors */}
                <div className="flex flex-wrap gap-2 items-center pt-1">
                  <span className="text-[10px] text-neutral-500 font-mono">Quick visuals:</span>
                  {PRESET_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.name}
                      onClick={() => setNewDrop({ ...newDrop, image: img.url })}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-neutral-300 border border-white/5 transition"
                    >
                      {img.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                  Vault Drop Lore / Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter collector notes, craftsmanship highlights, release details..."
                  value={newDrop.description}
                  onChange={(e) => setNewDrop({ ...newDrop, description: e.target.value })}
                  className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#c81d25] hover:bg-[#a5151c] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition uppercase tracking-wider shadow-lg shadow-[#c81d25]/30 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    '🚀 Confirm & Launch Drop'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
