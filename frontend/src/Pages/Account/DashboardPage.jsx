import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import AccountHeader from '../../Components/Account/AccountHeader'
import AccountProfileHero from '../../Components/Account/AccountProfileHero'
import AccountNavTabs from '../../Components/Account/AccountNavTabs'
import RecentDropOrders from '../../Components/Account/RecentDropOrders'
import ProfileSecurityCard from '../../Components/Account/ProfileSecurityCard'
import AccountAddresses from '../../Components/Account/AccountAddresses'
import AccountSidebarWidgets from '../../Components/Account/AccountSidebarWidgets'
import OrderTrackingModal from '../../Components/OrderTrackingModal'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function DashboardPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [trackingOrder, setTrackingOrder] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const handleNavClick = (navItem) => {
    if (navItem === 'ACCOUNT' || navItem === 'DASHBOARD') {
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
        {/* Header Breadcrumb & Server Sync */}
        <AccountHeader onNavigate={onNavigate} />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full pt-2">
          {/* Hero Profile Card */}
          <AccountProfileHero
            onOpenVaultPass={() => showToast('Opening NFC Vault Pass...')}
            onOpenPreferences={() => setActiveTab('security')}
            onSignOut={() => {
              showToast('Logged out successfully. Redirecting to login...')
              setTimeout(() => {
                if (onNavigate) {
                  onNavigate('LOGIN')
                } else {
                  navigate('/login')
                }
              }, 800)
            }}
          />

          {/* Navigation Tabs (Orders, Wishlist, Addresses, etc.) */}
          <AccountNavTabs
            activeTab={activeTab}
            onSelectTab={(tabId) => {
              setActiveTab(tabId)
              if (tabId === 'wishlist') {
                if (onNavigate) {
                  onNavigate('WISHLIST')
                } else {
                  navigate('/wishlist')
                }
              }
            }}
          />

          {/* 2-Column Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Tab Content */}
            <div className="lg:col-span-8">
              {activeTab === 'orders' && (
                <RecentDropOrders
                  onTrackOrder={(order) => setTrackingOrder(order || { orderNumber: 'DS-8492019', status: 'In Transit' })}
                  onViewInvoice={(order) => showToast(`Invoice downloaded for ${order?.orderNumber || '#DS-8492019'}`)}
                  onOrderHelp={() => showToast('Connecting to 24/7 VIP drop concierge...')}
                  onWriteReview={() => showToast('Write review form opened (+50 Vault Pts)')}
                  onViewCertificate={() => showToast('Vault NFT Authenticity certificate verified.')}
                  onReorder={() => showToast('Adding items back to your drop cart...')}
                />
              )}

              {activeTab === 'addresses' && (
                <AccountAddresses onToast={showToast} />
              )}

              {activeTab === 'security' && (
                <ProfileSecurityCard onToast={showToast} />
              )}

              {activeTab === 'rewards' && (
                <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
                    🏆
                  </div>
                  <h2 className="text-xl font-black text-neutral-900 mb-2">Vault Tier VIP Allocation Rewards</h2>
                  <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
                    You currently hold <span className="font-bold text-neutral-900">Tier 1 Core Status</span>. Every authenticated streetwear drop allocation unlocks zero-queue reservations and private deadstock drops.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                      <div className="text-xs font-bold text-[#c81d25] uppercase tracking-wider mb-1">01 / Priority</div>
                      <div className="text-sm font-bold text-neutral-900">Zero-Queue Access</div>
                      <div className="text-xs text-neutral-500 mt-1">Instant drop reservation 15 minutes before public drop release.</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                      <div className="text-xs font-bold text-[#c81d25] uppercase tracking-wider mb-1">02 / Concierge</div>
                      <div className="text-sm font-bold text-neutral-900">Vault Authenticator</div>
                      <div className="text-xs text-neutral-500 mt-1">Direct verification line to physical deadstock inspectors.</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                      <div className="text-xs font-bold text-[#c81d25] uppercase tracking-wider mb-1">03 / Shipping</div>
                      <div className="text-sm font-bold text-neutral-900">Complimentary Priority</div>
                      <div className="text-xs text-neutral-500 mt-1">Free armored tamper-evident courier dispatch worldwide.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Columns: Sidebar Widgets */}
            <div className="lg:col-span-4">
              <AccountSidebarWidgets
                onEditShipping={() => setActiveTab('addresses')}
                onManagePayment={() => showToast('Payment methods manager opened')}
                onViewWishlist={() => (onNavigate ? onNavigate('WISHLIST') : navigate('/wishlist'))}
                onExploreTierPerks={() => setActiveTab('rewards')}
                onAddCard={() => showToast('Add credit card form opened')}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        order={trackingOrder}
        isOpen={!!trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to VIP drop updates!`)} />
    </div>
  )
}
