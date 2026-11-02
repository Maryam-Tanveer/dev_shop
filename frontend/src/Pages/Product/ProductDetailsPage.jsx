import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import ProductBreadcrumb from '../../Components/ProductDetails/ProductBreadcrumb'
import ProductGallery from '../../Components/ProductDetails/ProductGallery'
import ProductInfo from '../../Components/ProductDetails/ProductInfo'
import ProductSpecsTabs from '../../Components/ProductDetails/ProductSpecsTabs'
import RelatedProducts from '../../Components/ProductDetails/RelatedProducts'
import { api } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import NotFoundPage from '../NotFound/NotFoundPage'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'
import { COLLECTIONS_DATA } from '../../data/collections'
import { DEALS_OF_THE_DAY } from '../../data/deals'
import { CATALOG_PRODUCTS } from '../../data/catalog'

const findFallbackProduct = (id) => {
  if (!id) return null
  const deal = DEALS_OF_THE_DAY.find((d) => d.id === id)
  const catalog = CATALOG_PRODUCTS.find((p) => p.id === id)
  const col = COLLECTIONS_DATA.find((c) => c.productId === id || c.id === id)

  const match = deal || catalog || col
  if (!match) return null

  const mainImage = match.image || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80'

  return {
    id: match.productId || match.id || id,
    title: match.title || 'Dev Shop Drop Item',
    fullTitle: match.fullTitle || match.title || 'Dev Shop Drop Item',
    brand: match.brand || 'Dev Shop Vault',
    category: match.category || 'Streetwear',
    price: Number(match.price) || 180,
    originalPrice: match.originalPrice ? Number(match.originalPrice) : null,
    rating: match.rating || 5.0,
    reviews: match.reviews || 120,
    badge: match.badge || 'VERIFIED',
    badgeColor: match.badgeColor || 'bg-[#c81d25] text-white',
    tag: match.tag || 'Vault Certified',
    subTag: match.subTag || 'IN VAULT TODAY',
    stockStatus: 'In Stock',
    stock: 15,
    image: mainImage,
    thumbnails: [
      { id: 'profile', label: 'PROFILE', image: mainImage },
      { id: 'front', label: 'FRONT', image: mainImage },
      { id: 'sole', label: 'SOLE GRIP', image: mainImage },
      { id: 'unbox', label: 'UNBOX', image: mainImage },
    ],
    colorways: [
      { id: 'default', name: 'Original Colorway', color: '#171717' },
      { id: 'stealth', name: 'Stealth Black', color: '#262626' },
    ],
    sizes: [
      { size: '8.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '8.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '9.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '9.5', status: '2 Left', badgeColor: 'text-[#c81d25] font-extrabold' },
      { size: '10.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '10.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
      { size: '11.0', status: 'Low', badgeColor: 'text-amber-600 font-bold' },
    ],
    description: match.description || `${match.title} is precision engineered for high-performance comfort and iconic street aesthetic with guaranteed physical vault authentication.`,
    descriptionSecond: 'Features shock-absorbing midsole cushioning, durable rubber tread traction, and hand-inspected finishing.',
    feature1Title: 'PREMIUM MATERIALS',
    feature1Subtitle: 'Hand-Crafted Finish',
    feature1Desc: 'Engineered with hand-stitched detailing and high-grade composite overlays.',
    feature2Title: 'DYNAMIC CUSHIONING',
    feature2Subtitle: 'High-Impact Rebound',
    feature2Desc: 'Cushioned footbed provides all-day structural stability and energy return.',
    releaseCode: `DS-${(id || 'DROP').toUpperCase()}-2024`,
    globalAllocation: 'Vault Certified Allocation',
    weight: '380g (Size 9 US)',
    origin: 'Certified Dev Shop Vault',
    verified: true,
  }
}

export default function ProductDetailsPage({ productId, onSelectProduct, onNavigate }) {
  const navigate = useNavigate()
  const { wishlistMap, wishlistCount, toggleWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const {
    items: cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('PRODUCTS')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!productId) {
      setNotFound(true)
      setLoading(false)
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    let isMounted = true
    setLoading(true)

    api
      .getProductById(productId)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setProduct(data)
            setNotFound(false)
          } else {
            const fallback = findFallbackProduct(productId)
            if (fallback) {
              setProduct(fallback)
              setNotFound(false)
            } else {
              setProduct(null)
              setNotFound(true)
            }
          }
        }
      })
      .catch((err) => {
        console.warn('API lookup returned error, resolving from vault fallback:', err.message)
        if (isMounted) {
          const fallback = findFallbackProduct(productId)
          if (fallback) {
            setProduct(fallback)
            setNotFound(false)
          } else {
            setProduct(null)
            setNotFound(true)
          }
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [productId])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleAddToCart = (productToAdd) => {
    addToCart(productToAdd)
    showToast(`Added ${productToAdd.title} to your drop bag!`)
  }

  const handleBuyNow = (configuredItem) => {
    addToCart(configuredItem || product)
    openDrawer()
  }

  const handleToggleWishlist = async (id) => {
    const targetId = id || product?.id
    const targetObj = targetId === product?.id ? product : targetId
    const inWishlist = await toggleWishlist(targetObj)
    showToast(inWishlist ? 'Added to Wishlist' : 'Removed from Wishlist')
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (onNavigate) {
      onNavigate(navItem)
    } else {
      const path = ROUTE_MAP[navItem] || (navItem ? `/${navItem.toLowerCase()}` : '/')
      navigate(path)
    }
  }

  if (notFound || (!loading && !product)) {
    return (
      <NotFoundPage
        title="404 - Drop Not Found"
        message={`We could not find product allocation "${productId || 'unknown'}" in the Dev Shop vault. The item may be delisted or the link is incorrect.`}
        onNavigate={onNavigate}
        onSelectProduct={onSelectProduct}
      />
    )
  }

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#fcfbfa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#c81d25] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
            Accessing Vault Allocation...
          </p>
        </div>
      </div>
    )
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

      <main className="flex-1 flex flex-col gap-8 pb-12">
        {/* Sub-header Breadcrumb & Drop Badges */}
        <ProductBreadcrumb
          product={product}
          onBack={() => (onNavigate ? onNavigate('HOME') : navigate('/'))}
        />

        {/* 2-Column Product Showcase Section */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Gallery & 3D Angle */}
            <div className="lg:col-span-6">
              <ProductGallery
                product={product}
                isWishlisted={!!wishlistMap[product.id]}
                onToggleWishlist={() => handleToggleWishlist(product.id)}
              />
            </div>

            {/* Right Column: Title, Price, Colorways, Sizes, CTAs */}
            <div className="lg:col-span-6">
              <ProductInfo
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onSizeGuide={() => showToast(`Standard ${product.brand} sizing applies (True to Size)`)}
              />
            </div>
          </div>
        </section>

        {/* Description, Specs & Customer Reviews Tabbed Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
          <ProductSpecsTabs product={product} />
        </div>

        {/* You May Also Like (Curated Pairings) */}
        <RelatedProducts
          onSelectProduct={onSelectProduct}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlistMap}
        />
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to drop notifications!`)} />
    </div>
  )
}
