import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import FaqHero from '../../Components/Faq/FaqHero'
import FaqAccordion from '../../Components/Faq/FaqAccordion'
import FaqContactBanner from '../../Components/Faq/FaqContactBanner'
import FaqContactModal from '../../Components/Faq/FaqContactModal'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function FaqPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user: currentUser } = useAuth()

  const urlCategory = searchParams.get('category') || 'shipping'
  const urlItem = searchParams.get('item') || ''

  const {
    items: cartItems,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()

  const [activeCategory, setActiveCategory] = useState(urlCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('FAQ')
  const [toast, setToast] = useState(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Keep state in sync if URL query parameter changes
  useEffect(() => {
    if (urlCategory && urlCategory !== activeCategory) {
      setActiveCategory(urlCategory)
    }
  }, [urlCategory])

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId)
    setSearchParams({ category: catId })
  }

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
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={cartItems}
        onRemoveItem={removeFromCart}
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
        onOpenCart={openDrawer}
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
          onSelectCategory={handleSelectCategory}
          onBackToHome={() => onNavigate && onNavigate('HOME')}
        />

        {/* 2. Accordion List with Badges */}
        <FaqAccordion
          activeCategory={activeCategory}
          initialOpenId={urlItem}
        />

        {/* 3. Contact Support Callout Card */}
        <FaqContactBanner
          onContactSupport={() => setIsContactModalOpen(true)}
        />
      </main>

      {/* 24/7 Concierge Support Modal */}
      <FaqContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to drop notifications!`)} />
    </div>
  )
}
