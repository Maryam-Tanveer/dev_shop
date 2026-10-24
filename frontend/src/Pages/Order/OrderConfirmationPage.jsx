import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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

export default function OrderConfirmationPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)

  const activeOrder = location.state?.order || {
    orderNumber: 'DEV-8492019',
    userEmail: 'collector@devshop.io',
    shippingAddress: { firstName: 'Collector', lastName: 'Member', city: 'New York', state: 'NY' },
    carrier: 'DHL Express Air Priority',
    status: 'In Transit',
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleNavClick = (navItem) => {
    if (onNavigate) {
      onNavigate(navItem)
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
        cartCount={0}
        onOpenCart={() => setIsDrawerOpen(true)}
        wishlistCount={4}
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
          <span className="text-neutral-800 font-semibold">Shop Experience</span>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full pt-2">
          {/* Hero Confirmation Card */}
          <OrderHeroConfirmation
            orderNumber={activeOrder.orderNumber || 'DEV-8492019'}
            customerName={activeOrder.shippingAddress?.firstName || 'Collector'}
            estDelivery="Oct 28 – Oct 30"
            trackingNumber={`DEV-EXP-${(activeOrder.orderNumber || '8492019').replace(/[^0-9]/g, '')}`}
            paymentMethod="Vault Authenticated Checkout"
          />

          {/* 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Tracking, Items, Shipping Destination */}
            <div className="lg:col-span-7">
              <OrderFulfillmentTracker
                onViewDigitalPass={() => setIsTrackingModalOpen(true)}
              />

              <OrderPurchasedItems />

              <OrderShippingDestination
                onAddGateCode={() => showToast('Gate code modal opened. Driver will be notified.')}
              />
            </div>

            {/* Right 5 Columns: Summary, Concierge, Suggested Pair */}
            <div className="lg:col-span-5 space-y-6">
              <OrderSummarySidebar
                onViewAccount={() => (onNavigate ? onNavigate('ACCOUNT') : navigate('/account'))}
                onContinueShopping={() => (onNavigate ? onNavigate('PRODUCTS') : navigate('/products'))}
                onPrintInvoice={() => window.print()}
                onDownloadPdf={() => showToast('Downloading Official Encrypted Receipt PDF...')}
              />

              <OrderHelpConcierge
                onChatClick={() => showToast('Connecting to 24/7 drop concierge...')}
                onHotlineClick={() => showToast('Dialing 1-800-DEV-DROP priority line...')}
                onAddSuggested={() => showToast('Added Eastside Archive Hoodie to your VIP hold list!')}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        order={activeOrder}
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to VIP drop updates!`)} />
    </div>
  )
}
