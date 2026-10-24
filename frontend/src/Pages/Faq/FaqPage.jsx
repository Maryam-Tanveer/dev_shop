import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import FaqHero from '../../Components/Faq/FaqHero'
import FaqAccordion from '../../Components/Faq/FaqAccordion'
import FaqContactBanner from '../../Components/Faq/FaqContactBanner'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function FaqPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('shipping')
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('FAQ')
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'FAQ') {
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
          showToast('Proceeding to encrypted checkout...')
          setIsCartOpen(false)
          if (onNavigate) {
            onNavigate('CHECKOUT')
          } else {
            navigate('/checkout')
          }
        }}
      />

      {/* Navbar */}
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={2}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 flex flex-col items-center">
        {/* 1. FAQ Hero with Breadcrumb & Category Pills */}
        <FaqHero
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onBackToHome={() => onNavigate && onNavigate('HOME')}
        />

        {/* 2. Accordion List with Badges */}
        <FaqAccordion activeCategory={activeCategory} />

        {/* 3. Contact Support Callout Card */}
        <FaqContactBanner
          onContactSupport={() => showToast('Opening live chat with Dev Shop concierge team...')}
        />
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to drop notifications!`)} />
    </div>
  )
}
