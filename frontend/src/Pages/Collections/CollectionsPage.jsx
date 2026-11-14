import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import CollectionsHeader from '../../Components/Collections/CollectionsHeader'
import CollectionsFilterBar from '../../Components/Collections/CollectionsFilterBar'
import CollectionsGrid from '../../Components/Collections/CollectionsGrid'
import CollectionsFeaturedCapsule from '../../Components/Collections/CollectionsFeaturedCapsule'
import { api } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

const CATEGORY_MAP = {
  'shoes': 'Shoes',
  'clothing': 'Dress & Clothing',
  'bags': 'Bags',
  'outerwear': 'Outerwear',
  'accessories': 'Accessories',
  'collabs': 'Exclusive Collabs',
  'retro-basketball': 'Shoes',
  'y2k-runners': 'Shoes',
  'streetwear-essentials': 'Dress & Clothing',
  'vault-collabs': 'Exclusive Collabs',
  'technical-outerwear': 'Outerwear',
  'limited-drops-care': 'Accessories',
  'new-arrivals': 'New Arrivals',
  'automated-collection': 'Automated Collection',
  'top-best-deals': 'Top Best Deals',
  'hydrogen': 'Hydrogen',
}

export default function CollectionsPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlCategory = searchParams.get('category') || 'all'

  const [activeFilter, setActiveFilter] = useState(urlCategory)

  // Keep activeFilter in sync when URL changes (e.g. clicking footer links)
  useEffect(() => {
    if (urlCategory && urlCategory !== activeFilter) {
      setActiveFilter(urlCategory)
    }
  }, [urlCategory])

  const handleSelectFilter = (filterId) => {
    setActiveFilter(filterId)
    if (filterId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: filterId })
    }
  }
  const {
    items: cart,
    cartCount,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('COLLECTIONS')
  const [toast, setToast] = useState(null)
  const [featuredDrop, setFeaturedDrop] = useState(null)

  useEffect(() => {
    let isMounted = true
    api
      .getHeroDrop()
      .then((data) => {
        if (isMounted && data) {
          setFeaturedDrop(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load featured drop in collections:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSelectCollection = (collection) => {
    if (!collection) return
    const targetCategory =
      CATEGORY_MAP[collection.category] ||
      collection.targetCategory ||
      CATEGORY_MAP[collection.id] ||
      collection.category ||
      collection.title

    const displayTitle = CATEGORY_MAP[collection.category] || collection.title
    showToast(`Opening ${displayTitle} collection...`)
    navigate(`/products?category=${encodeURIComponent(targetCategory)}`)
  }

  const handleDiscoverDrop = () => {
    showToast('Opening Retro Basketball drop collection...')
    navigate('/products?category=Retro%20Basketball')
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'COLLECTIONS') {
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
          showToast('Proceeding to checkout...')
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

      <main className="flex-1 flex flex-col">
        {/* 1. Header with Breadcrumb & Verified Units in Vault */}
        <CollectionsHeader onBackToHome={() => onNavigate && onNavigate('HOME')} />

        {/* 2. Horizontal Filter Bar */}
        <CollectionsFilterBar
          activeFilter={activeFilter}
          onSelectFilter={handleSelectFilter}
        />

        {/* 3. 6 High-Impact Showcase Cards Grid */}
        <CollectionsGrid
          activeFilter={activeFilter}
          onSelectCollection={handleSelectCollection}
        />

        {/* 4. Curator's Pick Featured Capsule Banner */}
        <CollectionsFeaturedCapsule
          featuredDrop={featuredDrop}
          onDiscoverDrop={handleDiscoverDrop}
          onSaveSeries={(saved) => showToast(saved ? 'Fall Capsule saved to your vault!' : 'Capsule removed.')}
        />
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to drop notifications!`)} />
    </div>
  )
}
