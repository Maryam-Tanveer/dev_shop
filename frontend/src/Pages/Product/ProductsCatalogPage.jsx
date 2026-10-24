import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import CatalogHeader from '../../Components/Catalog/CatalogHeader'
import CatalogSidebarFilters from '../../Components/Catalog/CatalogSidebarFilters'
import CatalogActiveFilters from '../../Components/Catalog/CatalogActiveFilters'
import CatalogProductCard from '../../Components/Catalog/CatalogProductCard'
import CatalogPagination from '../../Components/Catalog/CatalogPagination'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { api } from '../../services/api'
import { CATALOG_PRODUCTS as FALLBACK_PRODUCTS } from '../../data/catalog'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function ProductsCatalogPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const { wishlistMap, toggleWishlist, wishlistCount } = useWishlist()
  const [selectedCollection, setSelectedCollection] = useState('All')
  const [selectedSizes, setSelectedSizes] = useState(['9', '9.5'])
  const [priceRange, setPriceRange] = useState([50, 800])
  const [selectedBrands, setSelectedBrands] = useState(['nike', 'jordan'])
  const [sortBy, setSortBy] = useState('Featured')
  const {
    items: cart,
    cartCount,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('PRODUCTS')
  const [toast, setToast] = useState(null)
  const [visibleCount, setVisibleCount] = useState(6)
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    api
      .getProducts({ category: selectedCollection })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProducts(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load products from API:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedCollection])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const handleToggleBrand = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((b) => b !== brandId) : [...prev, brandId]
    )
  }

  const handleToggleWishlist = async (productId) => {
    const product = products.find((p) => p.id === productId) || productId
    const inWishlist = await toggleWishlist(product)
    showToast(inWishlist ? 'Added to your Wishlist!' : 'Removed from Wishlist')
  }

  const handleClearAll = () => {
    setSelectedCollection('All')
    setSelectedSizes([])
    setPriceRange([50, 800])
    setSelectedBrands([])
    showToast('Filters cleared')
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'PRODUCTS') {
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

      <main className="flex-1 pb-16">
        {/* Catalog Header */}
        <CatalogHeader
          itemCount={48}
          onBackToHome={() => onNavigate && onNavigate('HOME')}
        />

        {/* 2-Column Main Section: Sidebar Filters + Products Grid */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 3 Columns: Filter Sidebar */}
            <div className="lg:col-span-3">
              <CatalogSidebarFilters
                selectedCollection={selectedCollection}
                onSelectCollection={setSelectedCollection}
                selectedSizes={selectedSizes}
                onToggleSize={handleToggleSize}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedBrands={selectedBrands}
                onToggleBrand={handleToggleBrand}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Right 9 Columns: Active Filters, Sort & Product Grid */}
            <div className="lg:col-span-9">
              <CatalogActiveFilters
                collection={selectedCollection}
                onRemoveCollection={() => setSelectedCollection('All')}
                sizes={selectedSizes}
                onRemoveSizes={() => setSelectedSizes([])}
                priceRange={priceRange}
                onResetPrice={() => setPriceRange([50, 800])}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* Product Cards Grid: 3 Columns */}
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 border-4 border-[#c81d25] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                    Connecting to Drop Vault API...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.slice(0, visibleCount).map((product) => (
                    <CatalogProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={!!wishlistMap[product.id]}
                      onToggleWishlist={handleToggleWishlist}
                      onSelectProduct={onSelectProduct}
                    />
                  ))}
                </div>
              )}

              {/* Pagination / Load More */}
              <CatalogPagination
                currentCount={visibleCount}
                totalCount={48}
                onLoadMore={() => {
                  setVisibleCount((prev) => Math.min(48, prev + 6))
                  showToast('Loaded more drop inventory!')
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to catalog drops!`)} />
    </div>
  )
}
