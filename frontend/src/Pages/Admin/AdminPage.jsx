import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

import AdminAccessDenied from './components/AdminAccessDenied'
import AdminStats from './components/AdminStats'
import AdminFilters from './components/AdminFilters'
import AdminProductTable from './components/AdminProductTable'
import AdminDeployModal, { PRESET_IMAGES } from './components/AdminDeployModal'

export default function AdminPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { items, removeFromCart } = useCart()

  // Strict role-based authentication: Only JWT users with role === 'admin'
  const isAdmin = currentUser?.role === 'admin'

  // Inventory state
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [toast, setToast] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [stockEdits, setStockEdits] = useState({})

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

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // Load products on mount
  useEffect(() => {
    if (!isAdmin) return
    loadProducts()
  }, [isAdmin])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await api.getProducts({ limit: 100 })
      const list = res.data || res.products || res || []
      setProducts(Array.isArray(list) ? list : [])
    } catch {
      showToast('Notice: Loaded catalog using client vault storage.')
    } finally {
      setLoading(false)
    }
  }

  // Stock status updater
  const handleUpdateStatus = async (id, newStatus, currentStock) => {
    let nextStock = currentStock
    if (newStatus === 'Sold Out') nextStock = 0
    else if (newStatus === 'Low Stock' && currentStock > 3) nextStock = 2
    else if (newStatus === 'In Stock' && currentStock === 0) nextStock = 10

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stockStatus: newStatus, stock: nextStock } : p
      )
    )

    try {
      await api.updateProductStock(id, { stockStatus: newStatus, stock: nextStock })
      showToast(`Updated '${id}' to ${newStatus}`)
    } catch {
      showToast(`Saved '${id}' status locally.`)
    }
  }

  // Inline stock count saver
  const handleSaveStockCount = async (id) => {
    const rawVal = stockEdits[id]
    const nextCount = Math.max(0, parseInt(rawVal, 10) || 0)
    let autoStatus = 'In Stock'
    if (nextCount === 0) autoStatus = 'Sold Out'
    else if (nextCount <= 3) autoStatus = 'Low Stock'

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: nextCount, stockStatus: autoStatus } : p
      )
    )

    setStockEdits((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })

    try {
      await api.updateProductStock(id, { stock: nextCount, stockStatus: autoStatus })
      showToast(`Stock count for '${id}' set to ${nextCount}`)
    } catch {
      showToast(`Saved stock count locally.`)
    }
  }

  // Delete product allocation
  const handleDeleteDrop = async (id, title) => {
    if (!window.confirm(`Are you sure you want to archive/remove '${title}' from the vault?`)) {
      return
    }

    setProducts((prev) => prev.filter((p) => p.id !== id))

    try {
      await api.deleteProduct(id)
      showToast(`Archived drop '${title}'`)
    } catch {
      showToast(`Removed drop locally.`)
    }
  }

  // Deploy new drop submission
  const handleDeployDrop = async (e) => {
    e.preventDefault()
    if (!newDrop.title || !newDrop.price) {
      showToast('Please provide a drop title and price.')
      return
    }

    setIsSubmitting(true)
    const payload = {
      title: newDrop.title.trim(),
      brand: newDrop.brand.trim() || 'Dev Shop',
      category: newDrop.category,
      price: parseFloat(newDrop.price),
      originalPrice: newDrop.originalPrice ? parseFloat(newDrop.originalPrice) : null,
      stockStatus: newDrop.stockStatus,
      stock: parseInt(newDrop.stock, 10) || 20,
      badge: newDrop.badge,
      image: newDrop.image || PRESET_IMAGES[0].url,
      description: newDrop.description.trim() || 'Vault exclusive release.',
    }

    try {
      const res = await api.createProduct(payload)
      const createdItem = res.data || res.product || { ...payload, id: `drop-${Date.now()}` }

      setProducts((prev) => [createdItem, ...prev])
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

  // Filtered products calculation
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

  // Overview metrics calculations
  const totalDrops = products.length
  const inStockCount = products.filter((p) => p.stockStatus === 'In Stock').length
  const lowStockCount = products.filter((p) => p.stockStatus === 'Low Stock' || (p.stock > 0 && p.stock <= 3)).length
  const soldOutCount = products.filter((p) => p.stockStatus === 'Sold Out' || p.stock === 0).length
  const avgPrice = totalDrops > 0 ? (products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalDrops).toFixed(0) : 0

  return (
    <div className="min-h-screen bg-[#0e0e11] text-neutral-100 flex flex-col font-sans relative selection:bg-[#c81d25] selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#1a1a24] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#c81d25]/50 text-xs font-semibold animate-bounce"
        >
          <span className="w-2 h-2 rounded-full bg-[#c81d25] animate-ping" aria-hidden="true" />
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
        {!currentUser || !isAdmin ? (
          <AdminAccessDenied
            currentUser={currentUser}
            onLogin={() => navigate('/login')}
            onReturnHome={() => navigate('/')}
          />
        ) : (
          <div className="space-y-8">
            {/* Header with Title and Deploy Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  <span className="text-[11px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
                    VAULT COMMAND ONLINE // ADMIN: {currentUser.name || currentUser.email}
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
                  type="button"
                  onClick={() => setIsDeployModalOpen(true)}
                  aria-label="Open modal to deploy a new drop"
                  className="bg-[#c81d25] hover:bg-[#a5151c] text-white text-xs font-bold px-5 py-3 rounded-xl transition tracking-wider uppercase shadow-lg shadow-[#c81d25]/30 flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-base leading-none" aria-hidden="true">+</span> Deploy New Drop
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  aria-label="Return to customer storefront"
                  className="bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold px-4 py-3 rounded-xl border border-white/10 transition cursor-pointer"
                >
                  Storefront
                </button>
              </div>
            </div>

            {/* Metrics Dashboard Cards */}
            <AdminStats
              totalDrops={totalDrops}
              inStockCount={inStockCount}
              lowStockCount={lowStockCount}
              soldOutCount={soldOutCount}
              avgPrice={avgPrice}
            />

            {/* Filter and Search Bar */}
            <AdminFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Drops Table */}
            <AdminProductTable
              products={filteredProducts}
              loading={loading}
              stockEdits={stockEdits}
              onStockEditChange={(id, val) => setStockEdits({ ...stockEdits, [id]: val })}
              onSaveStockCount={handleSaveStockCount}
              onUpdateStatus={handleUpdateStatus}
              onDeleteDrop={handleDeleteDrop}
              onClearFilters={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedStatus('All')
              }}
            />
          </div>
        )}
      </main>

      {/* Deploy New Drop Modal */}
      <AdminDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onSubmit={handleDeployDrop}
        isSubmitting={isSubmitting}
        newDrop={newDrop}
        setNewDrop={setNewDrop}
      />

      <Footer />
    </div>
  )
}
