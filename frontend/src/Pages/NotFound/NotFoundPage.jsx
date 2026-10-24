import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Compass,
  ArrowRight,
  Flame,
  Search,
  AlertTriangle,
  Home,
  ShoppingBag,
} from 'lucide-react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import { useCart } from '../../context/CartContext'

export default function NotFoundPage({
  title = '404 - Drop Not Found in Vault',
  message = "The allocation, product ID, or page URL you are looking for does not exist in our archive. It may have been vaulted, delisted, or mistyped.",
  onNavigate,
  onSelectProduct,
}) {
  const navigate = useNavigate()
  const {
    items: cartItems,
    cartCount,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (onNavigate) {
      onNavigate(navItem)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    if (onNavigate) {
      onNavigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1a1a1a] flex flex-col font-sans relative selection:bg-[#c81d25] selection:text-white">
      {/* Toast */}
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
        items={cartItems}
        onRemoveItem={(id) => {
          removeFromCart(id)
          showToast('Item removed from drop bag.')
        }}
        onCheckout={() => {
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
        wishlistCount={2}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-8">
        <div className="max-w-2xl w-full text-center">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 bg-[#fde8e8] text-[#c81d25] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 border border-[#fecaca] shadow-xs">
            <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            <span>404 HTTP STATUS • ALLOCATION MISSING</span>
          </div>

          {/* Big Hero Number */}
          <div className="relative mb-4 select-none">
            <span className="text-8xl sm:text-9xl font-black tracking-tighter text-neutral-900 opacity-90 block">
              4<span className="text-[#c81d25]">0</span>4
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 opacity-20 pointer-events-none">
              DEV_SHOP_VAULT_ERROR_MISSING_ROUTE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mb-3">
            {title}
          </h1>

          {/* Message */}
          <p className="text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed mb-8 font-medium">
            {message}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search archive sneakers, drops, apparel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-800 placeholder-neutral-400 shadow-xs focus:outline-none focus:border-[#c81d25] transition"
              />
            </div>
            <button
              type="submit"
              className="bg-[#121212] hover:bg-neutral-800 text-white px-5 py-3 rounded-2xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              Search
            </button>
          </form>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              to="/products"
              onClick={() => onNavigate && onNavigate('PRODUCTS')}
              className="w-full sm:w-auto flex-1 bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-black py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition duration-200 cursor-pointer active:scale-98"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Drops Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              onClick={() => onNavigate && onNavigate('HOME')}
              className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold py-3.5 px-6 rounded-full border border-neutral-200 shadow-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Home className="w-4 h-4 text-neutral-500" />
              <span>Return Home</span>
            </Link>
          </div>

          {/* Popular shortcuts */}
          <div className="mt-12 pt-8 border-t border-neutral-200/60 max-w-md mx-auto">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Popular Archive Destinations
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold">
              <Link
                to="/products"
                onClick={() => onNavigate && onNavigate('PRODUCTS')}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition"
              >
                Retro Jordans
              </Link>
              <Link
                to="/collections"
                onClick={() => onNavigate && onNavigate('COLLECTIONS')}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition"
              >
                Curated Collections
              </Link>
              <Link
                to="/wishlist"
                onClick={() => onNavigate && onNavigate('WISHLIST')}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition"
              >
                Saved Wishlist
              </Link>
              <button
                onClick={openDrawer}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#c81d25]" />
                <span>Your Bag ({cartCount})</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to VIP drop updates!`)} />
    </div>
  )
}
