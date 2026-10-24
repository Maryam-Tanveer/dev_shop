import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import WishlistHeader from '../../Components/Wishlist/WishlistHeader'
import WishlistFilterBar from '../../Components/Wishlist/WishlistFilterBar'
import WishlistGrid from '../../Components/Wishlist/WishlistGrid'
import WishlistPerksBanner from '../../Components/Wishlist/WishlistPerksBanner'
import WishlistRecommendations from '../../Components/Wishlist/WishlistRecommendations'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function WishlistPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const {
    items,
    wishlistMap,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist()
  const [activeFilter, setActiveFilter] = useState('ALL')
  const {
    items: cart,
    cartCount,
    addToCart,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('WISHLIST')
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeFilter === 'IN_STOCK') return item.inStock && !item.isRare
    if (activeFilter === 'RARE') return item.isRare
    return true
  })

  const inStockCount = items.filter((i) => i.inStock && !i.isRare).length
  const rareCount = items.filter((i) => i.isRare).length

  const handleMoveToCart = (item) => {
    addToCart(item)
    removeFromWishlist(item.id)
    showToast(`Moved ${item.title} to drop bag!`)
  }

  const handleRemoveItem = (id) => {
    removeFromWishlist(id)
    showToast('Removed item from your wishlist.')
  }

  const handleClearAll = () => {
    if (items.length === 0) return
    clearWishlist()
    showToast('Wishlist cleared.')
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
    showToast('Wishlist link copied to clipboard!')
  }

  const handleAddRecToCart = (product) => {
    addToCart(product)
    showToast(`Added ${product.title} to drop bag!`)
  }

  const handleAddRecToWishlist = (product) => {
    if (items.some((i) => i.id === product.id)) {
      showToast(`${product.title} is already in your wishlist!`)
      return
    }
    addToWishlist({
      ...product,
      badge: product.category,
      badgeColor: 'bg-[#18181b] text-white',
      style: 'SP-2025',
      stockStatus: 'In Stock',
      size: "MEN'S US 9.5",
      isRare: false,
      inStock: true,
    })
    showToast(`Saved ${product.title} to your wishlist!`)
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'WISHLIST') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (onNavigate) {
      onNavigate(navItem)
    } else {
      const path = ROUTE_MAP[navItem] || (navItem ? `/${navItem.toLowerCase()}` : '/')
      navigate(path)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1a1a1a] flex flex-col font-sans relative selection:bg-[#c81d25] selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 text-xs font-semibold animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#c81d25] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={cart}
        onRemoveItem={(id) => {
          removeFromCart(id)
          showToast('Item removed from drop bag.')
        }}
        onCheckout={() => {
          showToast('Proceeding to encrypted checkout...')
          closeDrawer()
          if (onNavigate) {
            onNavigate('CHECKOUT')
          } else {
            navigate('/checkout')
          }
        }}
      />

      {/* Navbar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={openDrawer}
        wishlistCount={wishlistCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 flex flex-col gap-2 pb-12">
        {/* 1. Header with Breadcrumbs & Title */}
        <WishlistHeader
          itemCount={wishlistCount}
          onShare={handleShare}
          onClearAll={handleClearAll}
          onBackToHome={() => onNavigate && onNavigate('HOME')}
        />

        {/* 2. Filter Pills & Alert Bar */}
        <WishlistFilterBar
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          totalCount={wishlistCount}
          inStockCount={inStockCount}
          rareCount={rareCount}
        />

        {/* 3. Wishlist Cards Grid */}
        <WishlistGrid
          items={filteredItems}
          onMoveToCart={handleMoveToCart}
          onRemoveItem={handleRemoveItem}
          onSelectProduct={onSelectProduct}
        />

        {/* 4. Value Propositions Banner (Dark Card) */}
        <WishlistPerksBanner />

        {/* 5. Recently Viewed & Recommendations */}
        <WishlistRecommendations
          onAddToCart={handleAddRecToCart}
          onAddToWishlist={handleAddRecToWishlist}
          onSelectProduct={onSelectProduct}
          wishlist={wishlistMap}
        />
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to drop notifications!`)} />
    </div>
  )
}
