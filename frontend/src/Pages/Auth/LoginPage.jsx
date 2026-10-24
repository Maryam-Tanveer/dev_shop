import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import AuthBreadcrumb from '../../Components/Auth/AuthBreadcrumb'
import AuthCard from '../../Components/Auth/AuthCard'
import AuthTrustBar from '../../Components/Auth/AuthTrustBar'
import { useAuth } from '../../context/AuthContext'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function LoginPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading } = useAuth()

  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState({ 'deal-1': true })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('CHECKOUT')
  const [toast, setToast] = useState(null)

  const redirectTarget = location.state?.from?.pathname || '/account'

  // If already logged in, redirect away from login page
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTarget, { replace: true })
    }
  }, [isAuthenticated, loading, redirectTarget, navigate])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleLoginSuccess = (userData) => {
    showToast(`Welcome back, ${userData.name}! Session authenticated.`)
    setTimeout(() => {
      if (onNavigate) {
        onNavigate('ACCOUNT')
      } else {
        navigate(redirectTarget, { replace: true })
      }
    }, 900)
  }

  const handleSignUpSuccess = (userData) => {
    showToast(`Welcome to the Vault, ${userData.name}! Account created successfully.`)
    setTimeout(() => {
      if (onNavigate) {
        onNavigate('ACCOUNT')
      } else {
        navigate(redirectTarget, { replace: true })
      }
    }, 900)
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'LOGIN') {
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
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={(id) => setCart((prev) => prev.filter((item, idx) => (item.cartItemId || idx) !== id))}
        onCheckout={() => {
          showToast('Proceeding to checkout...')
          setIsCartOpen(false)
        }}
      />

      {/* Navbar */}
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={Object.values(wishlist).filter(Boolean).length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 flex flex-col justify-between">
        {/* Breadcrumb & Drop Access Session Ticker */}
        <AuthBreadcrumb onHomeClick={() => onNavigate && onNavigate('HOME')} />

        {/* Center Auth Card with subtle ambient lighting */}
        <section className="w-full px-4 sm:px-8 py-10 sm:py-14 flex items-center justify-center relative">
          {/* Subtle soft backdrop glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-100/40 rounded-full blur-[140px] pointer-events-none -z-10" />

          <AuthCard
            initialTab="signin"
            onLoginSuccess={handleLoginSuccess}
            onSignUpSuccess={handleSignUpSuccess}
          />
        </section>

        {/* 3 Trust Proposition Cards */}
        <AuthTrustBar />
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to drop notifications!`)} />
    </div>
  )
}
