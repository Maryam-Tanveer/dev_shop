import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import BlogHeader from '../../Components/Blog/BlogHeader'
import BlogCategoryFilter from '../../Components/Blog/BlogCategoryFilter'
import BlogGrid from '../../Components/Blog/BlogGrid'
import BlogNewsletterCard from '../../Components/Blog/BlogNewsletterCard'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function BlogPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('all')
  const [bookmarks, setBookmarks] = useState({ 'post-1': true })
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('BLOG')
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleToggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      showToast(next[id] ? 'Article saved to your bookmarks!' : 'Article removed from bookmarks.')
      return next
    })
  }

  const handleReadPost = (post) => {
    showToast(`Opening editorial dispatch: "${post.title}"`)
  }

  const handleSubscribe = (email) => {
    showToast(`Subscribed ${email} to Dev Shop Friday Insider Dispatches!`)
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'BLOG') {
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

      <main className="flex-1 flex flex-col">
        {/* 1. Blog Header & Curators Badge */}
        <BlogHeader onBackToHome={() => onNavigate && onNavigate('HOME')} />

        {/* 2. Category Filter Container */}
        <BlogCategoryFilter
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* 3. Editorial Dispatches Grid & Pagination */}
        <BlogGrid
          activeFilter={activeFilter}
          onReadPost={handleReadPost}
          onBookmarkPost={handleToggleBookmark}
          bookmarks={bookmarks}
        />

        {/* 4. Insider Briefing Newsletter Card */}
        <BlogNewsletterCard onSubscribe={handleSubscribe} />
      </main>

      {/* Footer */}
      <Footer onSubscribe={handleSubscribe} />
    </div>
  )
}
