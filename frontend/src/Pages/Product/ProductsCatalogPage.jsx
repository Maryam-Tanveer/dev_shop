import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
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
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function ProductsCatalogPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { wishlistMap, toggleWishlist, wishlistCount } = useWishlist()
  const [selectedCollection, setSelectedCollection] = useState('All')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [priceRange, setPriceRange] = useState([50, 800])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [sortBy, setSortBy] = useState('Featured')
  const {
    items: cart,
    cartCount,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [activeNav, setActiveNav] = useState('PRODUCTS')
  const [toast, setToast] = useState(null)
  const [visibleCount, setVisibleCount] = useState(6)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Keep search query in sync with URL ?search= param
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch !== null && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    api
      .getProducts({ category: selectedCollection })
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
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

  // Dynamically filter and sort products based on all active criteria
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : []

    // 0. Search Query filter (matches title, fullTitle, brand, category, description, id)
    if (searchQuery && searchQuery.trim()) {
      const qTokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean)
      list = list.filter((p) => {
        const text = `${p.title || ''} ${p.fullTitle || ''} ${p.brand || ''} ${p.category || ''} ${p.description || ''} ${p.id || ''}`.toLowerCase()
        return qTokens.every((token) => text.includes(token))
      })
    }

    // 1. Price Range filter
    if (Array.isArray(priceRange) && priceRange.length === 2) {
      const [min, max] = priceRange
      list = list.filter((p) => {
        const price = Number(p.price) || 0
        return price >= min && price <= max
      })
    }

    // 2. Brand filter
    if (selectedBrands && selectedBrands.length > 0) {
      list = list.filter((p) => {
        const brandStr = (p.brand || '').toLowerCase()
        const titleStr = (p.title || '').toLowerCase()
        const fullTitleStr = (p.fullTitle || '').toLowerCase()
        return selectedBrands.some((b) => {
          const bLower = b.toLowerCase()
          return (
            brandStr.includes(bLower) ||
            titleStr.includes(bLower) ||
            fullTitleStr.includes(bLower)
          )
        })
      })
    }

    // 3. Size filter
    if (selectedSizes && selectedSizes.length > 0) {
      list = list.filter((p) => {
        if (!p.sizes || p.sizes.length === 0) return true
        const pSizes = p.sizes.map((s) => String(s).trim())
        return selectedSizes.some((s) => pSizes.includes(String(s).trim()))
      })
    }

    // 4. Sort By
    if (sortBy === 'Price: Low to High') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    } else if (sortBy === 'Price: High to Low') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    } else if (sortBy === 'Newest Drops') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    } else if (sortBy === 'Most Hyped') {
      list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    }

    return list
  }, [products, searchQuery, priceRange, selectedBrands, selectedSizes, sortBy])

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
    setPriceRange([0, 1000])
    setSelectedBrands([])
    setSearchQuery('')
    setSearchParams({})
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
        onSearchChange={(q) => {
          setSearchQuery(q)
          setSearchParams(q ? { search: q } : {})
        }}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 pb-16">
        {/* Catalog Header */}
        <CatalogHeader
          itemCount={filteredProducts.length}
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
                brands={selectedBrands}
                onRemoveBrands={() => setSelectedBrands([])}
                priceRange={priceRange}
                onResetPrice={() => setPriceRange([0, 1000])}
                searchQuery={searchQuery}
                onRemoveSearch={() => {
                  setSearchQuery('')
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev)
                    next.delete('search')
                    return next
                  })
                }}
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
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 px-6 bg-white rounded-3xl border border-neutral-200 text-center flex flex-col items-center justify-center shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-[#c81d25] mb-4">
                    <SlidersHorizontal className="w-7 h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 mb-2">
                    {searchQuery
                      ? `No drops found for "${searchQuery}"`
                      : 'No drops found matching criteria'}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-md mb-6 leading-relaxed">
                    {searchQuery
                      ? `We couldn't find any products matching "${searchQuery}". Try searching for terms like "Jordan 1", "Yeezy", "Snowboard", or "Nike".`
                      : `No items in our vault match the price range $${priceRange[0]} – $${priceRange[1]}. Try widening the price range or resetting filters.`}
                  </p>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-6 py-2.5 bg-[#c81d25] hover:bg-[#a6171e] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.slice(0, visibleCount).map((product) => (
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
              {filteredProducts.length > visibleCount && (
                <CatalogPagination
                  currentCount={Math.min(visibleCount, filteredProducts.length)}
                  totalCount={filteredProducts.length}
                  onLoadMore={() => {
                    setVisibleCount((prev) => Math.min(filteredProducts.length, prev + 6))
                    showToast('Loaded more drop inventory!')
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to catalog drops!`)} />
    </div>
  )
}
