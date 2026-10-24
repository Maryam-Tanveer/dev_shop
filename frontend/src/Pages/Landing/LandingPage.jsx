import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import DropTicker from '../../Components/Landing/DropTicker'
import HeroSection from '../../Components/Landing/HeroSection'
import DealsSection from '../../Components/Landing/DealsSection'
import CollectionsSection from '../../Components/Landing/CollectionsSection'
import BlogSection from '../../Components/Landing/BlogSection'
import TrustSection from '../../Components/Landing/TrustSection'
import { useCart } from '../../context/CartContext'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function LandingPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const {
    items: cart,
    cartCount,
    addToCart,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()

  const [wishlist, setWishlist] = useState({ 'deal-1': true })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('HOME')
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    showToast(`Added ${product.title} to your drop bag!`)
  }

  const handleRemoveFromCart = (id) => {
    removeFromCart(id)
  }

  const handleToggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      showToast(next[id] ? 'Added to Wishlist' : 'Removed from Wishlist')
      return next
    })
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'HOME') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (onNavigate) {
      onNavigate(navItem)
    } else {
      const path = ROUTE_MAP[navItem] || (navItem ? `/${navItem.toLowerCase()}` : '/')
      navigate(path)
    }
  }

  const handleSubscribe = (email) => {
    showToast(`Subscribed ${email} to drop notifications!`)
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
        onRemoveItem={handleRemoveFromCart}
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

      {/* 1 & 2: Top Bar & Navbar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={openDrawer}
        wishlistCount={Object.values(wishlist).filter(Boolean).length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 flex flex-col">
        {/* 3: Breadcrumb & Drop Vault Ticker */}
        <DropTicker />

        {/* 4: Hero Section (Air Jordan 6 GX Eastside + Sneakers Fest Pass) */}
        <HeroSection
          onAddToCart={handleAddToCart}
          onSelectProduct={onSelectProduct}
          onEventDetails={() => showToast('Redirecting to Sneakers Fest ID registration...')}
        />

        {/* 5: Top Best Deals Section (4 Cards + Countdown Timer + Quick Add) */}
        <DealsSection
          onAddToCart={handleAddToCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={onSelectProduct}
        />

        {/* 6: Shop by Collection (Sneakers, Apparel, Accessories, Limited Drops) */}
        <CollectionsSection
          onSelectCollection={(collection) => {
            if (typeof collection === 'string') {
              showToast(`Selected collection: ${collection}`)
              if (onNavigate) {
                onNavigate('COLLECTIONS')
              } else {
                navigate('/collections')
              }
              return
            }
            showToast(`Exploring ${collection.title}...`)
            if (onSelectProduct && collection.productId) {
              onSelectProduct(collection.productId)
            } else if (collection.productId) {
              navigate(`/product/${collection.productId}`)
            } else if (onNavigate) {
              onNavigate('COLLECTIONS')
            } else {
              navigate('/collections')
            }
          }}
        />

        {/* 7: Latest from the Blog (3 Cultural Editorial Stories) */}
        <BlogSection
          onReadPost={(post) => showToast(`Opening article: ${post.title}`)}
        />

        {/* 8: Trust / Value Propositions (Free Shipping, Returns, Security, Support) */}
        <TrustSection />
      </main>

      {/* 9: Dark Charcoal Footer */}
      <Footer onSubscribe={handleSubscribe} />
    </div>
  )
}
