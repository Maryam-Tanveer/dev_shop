import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { PackageX, ArrowLeft } from 'lucide-react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import OrderHeroConfirmation from '../../Components/OrderConfirmation/OrderHeroConfirmation'
import OrderFulfillmentTracker from '../../Components/OrderConfirmation/OrderFulfillmentTracker'
import OrderPurchasedItems from '../../Components/OrderConfirmation/OrderPurchasedItems'
import OrderShippingDestination from '../../Components/OrderConfirmation/OrderShippingDestination'
import OrderSummarySidebar from '../../Components/OrderConfirmation/OrderSummarySidebar'
import OrderHelpConcierge from '../../Components/OrderConfirmation/OrderHelpConcierge'
import OrderTrackingModal from '../../Components/OrderTrackingModal'
import { useCart } from '../../context/CartContext'
import { api } from '../../services/api'

export default function OrderConfirmationPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart, cartCount } = useCart()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)

  const [activeOrder, setActiveOrder] = useState(location.state?.order || null)
  const [isVerifying, setIsVerifying] = useState(
    Boolean(new URLSearchParams(location.search).get('session_id'))
  )

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sessionId = params.get('session_id')
    if (sessionId) {
      setIsVerifying(true)
      api
        .verifyPaymentSession(sessionId)
        .then((res) => {
          if (res.success && res.order) {
            setActiveOrder(res.order)
            clearCart()
            showToast('Stripe payment confirmed! Receipt dispatched.')
          }
        })
        .catch((err) => {
          console.warn('[Stripe session verify]:', err.message)
          showToast('Payment verification failed or session expired.')
        })
        .finally(() => {
          setIsVerifying(false)
        })
    }
  }, [location.search])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleNavClick = (navItem) => {
    if (onNavigate) {
      onNavigate(navItem)
    } else {
      navigate(navItem === 'HOME' ? '/' : `/${navItem.toLowerCase()}`)
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
        onClose={() => setIsDrawerOpen(false)}
        items={[]}
        onRemoveItem={() => {}}
        onCheckout={() => {
          setIsDrawerOpen(false)
          if (onNavigate) {
            onNavigate('CHECKOUT')
          } else {
            navigate('/checkout')
          }
        }}
      />

      {/* Navbar */}
      <Navbar
        onOpenCart={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav=""
        onNavClick={handleNavClick}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full text-[11px] text-neutral-400 font-medium">
          <Link
            to="/"
            onClick={() => onNavigate && onNavigate('HOME')}
            className="hover:text-neutral-700 transition"
          >
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-800 font-semibold">Order Confirmation</span>
        </div>

        {isVerifying ? (
          <div className="max-w-md mx-auto py-24 text-center px-4">
            <div className="w-12 h-12 border-4 border-[#c81d25] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Verifying Stripe Payment...
            </h2>
            <p className="text-xs text-neutral-500 mt-2 font-medium">
              Authenticating multi-point payment signature with Stripe vault.
            </p>
          </div>
        ) : !activeOrder ? (
          <div className="max-w-md mx-auto py-24 text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4 border border-neutral-200">
              <PackageX className="w-8 h-8 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">
              Order nahi mila
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed mb-6 font-medium">
              Humein is session ya ID ka koi confirmed order record nahi mila. Agar aap ne payment ki hai to apna email check karein ya customer concierge se rabta karein.
            </p>
            <button
              onClick={() => (onNavigate ? onNavigate('PRODUCTS') : navigate('/products'))}
              className="inline-flex items-center gap-2 bg-[#c81d25] hover:bg-[#a8161d] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full pt-2">
            {/* Hero Confirmation Card */}
            <OrderHeroConfirmation
              orderNumber={activeOrder.orderNumber || 'DEV-VAULT'}
              customerName={activeOrder.shippingAddress?.firstName || 'Collector'}
              estDelivery="Oct 28 – Oct 30"
              trackingNumber={`DEV-EXP-${(activeOrder.orderNumber || 'VAULT').replace(/[^0-9]/g, '')}`}
              paymentMethod={activeOrder.paymentMethod || 'Stripe Authenticated Checkout'}
            />

            {/* 2-Column Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Columns: Tracking, Items, Shipping Destination */}
              <div className="lg:col-span-7">
                <OrderFulfillmentTracker
                  onViewDigitalPass={() => setIsTrackingModalOpen(true)}
                />

                <OrderPurchasedItems items={activeOrder.items} />

                <OrderShippingDestination
                  shippingAddress={activeOrder.shippingAddress}
                  recipientName={
                    activeOrder.shippingAddress?.fullName ||
                    (activeOrder.shippingAddress?.firstName
                      ? `${activeOrder.shippingAddress.firstName} ${activeOrder.shippingAddress.lastName || ''}`.trim()
                      : null)
                  }
                  onAddGateCode={() => showToast('Gate code modal opened. Driver will be notified.')}
                />
              </div>

              {/* Right 5 Columns: Summary, Concierge, Suggested Pair */}
              <div className="lg:col-span-5 space-y-6">
                <OrderSummarySidebar
                  order={activeOrder}
                  onViewAccount={() => (onNavigate ? onNavigate('ACCOUNT') : navigate('/account'))}
                  onContinueShopping={() => (onNavigate ? onNavigate('PRODUCTS') : navigate('/products'))}
                  onPrintInvoice={() => window.print()}
                />

                <OrderHelpConcierge />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Live Order Tracking Modal */}
      {activeOrder && (
        <OrderTrackingModal
          order={activeOrder}
          isOpen={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to VIP drop updates!`)} />
    </div>
  )
}
