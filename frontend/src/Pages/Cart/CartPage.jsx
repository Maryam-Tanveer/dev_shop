import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import CartHeader from '../../Components/Cart/CartHeader'
import CartDeliveryProgress from '../../Components/Cart/CartDeliveryProgress'
import CartItemList from '../../Components/Cart/CartItemList'
import CartOrderSummary from '../../Components/Cart/CartOrderSummary'
import CartCrossSells from '../../Components/Cart/CartCrossSells'
import CartEmptyState from '../../Components/Cart/CartEmptyState'
import { useCart } from '../../context/CartContext'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function CartPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const {
    items,
    totalItemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    resetToSampleCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()

  const [wishlist, setWishlist] = useState({ 'deal-1': true, 'rel-3': true })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('CART')
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleUpdateQuantity = (id, newQty) => {
    updateQuantity(id, newQty)
  }

  const handleRemoveItem = (id) => {
    removeFromCart(id)
    showToast('Item removed from your drop bag.')
  }

  const handleSaveToWishlist = (item) => {
    setWishlist((prev) => ({ ...prev, [item.id]: true }))
    removeFromCart(item.id)
    showToast(`Saved ${item.title} to your wishlist!`)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    showToast(`Added ${product.title} to your drop bag!`)
  }

  const handleToggleSampleCart = () => {
    if (items.length === 0) {
      resetToSampleCart()
      showToast('Loaded demo items into cart.')
    } else {
      clearCart()
      showToast('Emptied shopping bag.')
    }
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'CART') {
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

      {/* Cart Drawer for slide-over toggle */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={items}
        onRemoveItem={handleRemoveItem}
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
        cartCount={totalItemCount}
        onOpenCart={openDrawer}
        wishlistCount={Object.keys(wishlist).length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 flex flex-col gap-2 pb-12">
        {/* Toggle between Empty State and Filled State */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-2 w-full flex justify-end">
          <button
            onClick={handleToggleSampleCart}
            className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-full border border-neutral-200 transition"
          >
            {items.length === 0 ? 'Switch to Filled Cart (2 Items)' : 'Switch to Empty Bag'}
          </button>
        </div>

        {items.length === 0 ? (
          /* EMPTY CART PAGE EXPERIENCE (As shown in user screenshot) */
          <>
            {/* Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-2 pb-2 w-full text-[11px] text-neutral-400 font-medium">
              <Link
                to="/"
                onClick={() => onNavigate && onNavigate('HOME')}
                className="hover:text-neutral-700 transition"
              >
                Home
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-neutral-500">Cart</span>
              <span className="mx-1.5">/</span>
              <span className="text-neutral-800 font-semibold">Empty Bag</span>
            </div>

            <CartEmptyState
              onExploreDrops={() => (onNavigate ? onNavigate('PRODUCTS') : navigate('/products'))}
              onViewWishlist={() => (onNavigate ? onNavigate('WISHLIST') : navigate('/wishlist'))}
              onQuickAdd={handleAddToCart}
              onSelectProduct={onSelectProduct}
              onSearchTag={(tag) => showToast(`Searching drops for "${tag}"`)}
              wishlist={wishlist}
              onToggleWishlist={(id) => {
                setWishlist((prev) => ({ ...prev, [id]: !prev[id] }))
                showToast('Wishlist updated!')
              }}
            />
          </>
        ) : (
          /* FILLED CART PAGE EXPERIENCE */
          <>
            {/* Header with Breadcrumb & Action Badges */}
            <CartHeader
              itemCount={items.length}
              onOpenSlideOver={() => setIsDrawerOpen(true)}
              onBackToHome={() => (onNavigate ? onNavigate('HOME') : navigate('/'))}
            />

            {/* Main 2-Column Cart Area */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-3 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 8 Cols: Delivery progress bar & cart items */}
                <div className="lg:col-span-8">
                  <CartDeliveryProgress progress={100} isUnlocked={true} />

                  <CartItemList
                    items={items}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onSaveToWishlist={handleSaveToWishlist}
                    onContinueShopping={() => (onNavigate ? onNavigate('PRODUCTS') : navigate('/products'))}
                    onSelectProduct={onSelectProduct}
                  />
                </div>

                {/* Right 4 Cols: Order Summary, promo, checkout, and sizing chat */}
                <div className="lg:col-span-4">
                  <CartOrderSummary
                    subtotal={subtotal}
                    itemCount={totalItemCount}
                    onProceedCheckout={() => {
                      showToast('Redirecting to SSL encrypted checkout...')
                      if (onNavigate) {
                        onNavigate('CHECKOUT')
                      } else {
                        navigate('/checkout')
                      }
                    }}
                    onOpenChat={() => showToast('Connecting to 24/7 streetwear advisor...')}
                    onApplyPromo={(amount, code) => showToast(`Promo code ${code} applied (-$${amount})!`)}
                  />
                </div>
              </div>
            </section>

            {/* Frequently Paired ("Complete The Look") */}
            <CartCrossSells
              onAddToCart={handleAddToCart}
              onAddToWishlist={(p) => {
                setWishlist((prev) => ({ ...prev, [p.id]: true }))
                showToast(`Added ${p.title} to Wishlist!`)
              }}
              onSelectProduct={onSelectProduct}
              wishlist={wishlist}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to drop notifications!`)} />
    </div>
  )
}

