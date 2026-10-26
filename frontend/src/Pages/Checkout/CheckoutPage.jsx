import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, PackageCheck, ArrowRight, X } from 'lucide-react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import CheckoutHeader from '../../Components/Checkout/CheckoutHeader'
import ContactInformationCard from '../../Components/Checkout/ContactInformationCard'
import ShippingAddressCard from '../../Components/Checkout/ShippingAddressCard'
import ShippingMethodCard from '../../Components/Checkout/ShippingMethodCard'
import OrderBreakdownCard from '../../Components/Checkout/OrderBreakdownCard'
import PaymentMethodCard from '../../Components/Checkout/PaymentMethodCard'
import AntiCounterfeitPolicyCard from '../../Components/Checkout/AntiCounterfeitPolicyCard'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { ROUTE_MAP } from '../../hooks/useAppNavigate'

export default function CheckoutPage({ onNavigate, onSelectProduct }) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const {
    items: cartItems,
    removeFromCart,
    cartCount,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    clearCart,
  } = useCart()

  const items = cartItems
  const [shippingMethod, setShippingMethod] = useState('standard') // 'standard' | 'priority'
  const [discountAmount, setDiscountAmount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('CHECKOUT')
  const [toast, setToast] = useState(null)
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const defaultAddr = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0]
  const [shippingAddress, setShippingAddress] = useState({
    firstName: currentUser?.name?.split(' ')[0] || defaultAddr?.firstName || '',
    lastName: currentUser?.name?.split(' ')[1] || defaultAddr?.lastName || '',
    address: defaultAddr?.address || '',
    apartment: defaultAddr?.apartment || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    zipCode: defaultAddr?.zipCode || '',
    country: defaultAddr?.country || 'US',
  })

  const [contactInfo, setContactInfo] = useState({
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  })

  useEffect(() => {
    if (currentUser) {
      const def = currentUser.addresses?.find((a) => a.isDefault) || currentUser.addresses?.[0]
      setContactInfo((prev) => ({
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
      }))
      if (def) {
        setShippingAddress({
          firstName: def.firstName || currentUser.name?.split(' ')[0] || '',
          lastName: def.lastName || currentUser.name?.split(' ')[1] || '',
          address: def.address || '',
          apartment: def.apartment || '',
          city: def.city || '',
          state: def.state || '',
          zipCode: def.zipCode || '',
          country: def.country || 'US',
        })
      }
    }
  }, [currentUser])

  // Calculations matching cart content
  const shippingCost = items.length > 0 ? (shippingMethod === 'priority' ? 25.00 : 0.00) : 0.00
  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
  const tax = Number((subtotal * 0.08).toFixed(2))
  const totalAmount = Number((Math.max(0, subtotal - discountAmount + shippingCost + tax)).toFixed(2))

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
    if (navItem === 'CHECKOUT') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (onNavigate) {
      onNavigate(navItem)
    } else {
      const path = ROUTE_MAP[navItem] || (navItem ? `/${navItem.toLowerCase()}` : '/')
      navigate(path)
    }
  }

  const handlePlaceOrder = async (paymentDetails = {}) => {
    if (items.length === 0) {
      showToast('Your bag is empty! Add products before placing an order.')
      return
    }

    const resolvedAddress = shippingAddress.streetAddress || shippingAddress.address || 'Vault Delivery Hub'
    const resolvedCity = shippingAddress.city || 'New York'
    const resolvedZip = shippingAddress.postalCode || shippingAddress.zipCode || '10012'

    const checkoutPayload = {
      email: contactInfo.email || currentUser?.email || 'collector@devshop.io',
      items: items.map((it) => ({
        productId: String(it.productId || it.id || 'deal-1'),
        quantity: it.quantity || 1,
        size: it.size || 'Standard',
        colorway: it.colorway || it.color || 'Default',
      })),
      shippingAddress: {
        firstName: shippingAddress.firstName || currentUser?.name?.split(' ')[0] || 'Collector',
        lastName: shippingAddress.lastName || currentUser?.name?.split(' ')[1] || 'Member',
        address: resolvedAddress,
        apartment: shippingAddress.apartment || '',
        city: resolvedCity,
        state: shippingAddress.state || 'NY',
        zipCode: resolvedZip,
        country: shippingAddress.country || 'US',
      },
      shippingMethod,
    }

    const isCardPayment =
      paymentDetails?.paymentType === 'stripe' ||
      paymentDetails?.paymentType === 'card' ||
      paymentDetails?.paymentType === 'digital' ||
      !paymentDetails?.paymentType

    if (isCardPayment) {
      showToast('Connecting to Stripe 256-bit secure checkout...')
      try {
        const stripeRes = await api.createCheckoutSession(checkoutPayload)
        if (stripeRes.success && stripeRes.url) {
          clearCart()
          window.location.href = stripeRes.url
          return
        }
      } catch (stripeErr) {
        console.warn('[Stripe Checkout Session fallback]:', stripeErr.message)
      }
    }

    // COD or Offline Fallback
    showToast('Placing order...')
    try {
      const res = await api.createOrder({
        ...checkoutPayload,
        paymentMethod: paymentDetails?.paymentType === 'cod' ? 'cod' : 'stripe-card',
      })
      const createdOrder = res.data
      clearCart()
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('ORDER_CONFIRMATION')
        } else {
          navigate('/order-confirmation', { state: { order: createdOrder || checkoutPayload } })
        }
      }, 600)
    } catch (err) {
      console.error('Checkout error:', err)
      showToast('Order placement failed. Please try again.')
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
        onRemoveItem={(id) => {
          removeFromCart(id)
          showToast('Item removed from order.')
        }}
        onCheckout={() => closeDrawer()}
      />

      {/* Order Confirmed Modal */}
      {isOrderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl border border-neutral-100 relative">
            <button
              onClick={() => setIsOrderConfirmed(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-9 h-9 stroke-[2]" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2 inline-block">
              ORDER DISPATCH AUTHORIZED
            </span>

            <h3 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">
              Order #DEV-94821 Confirmed
            </h3>

            <p className="text-xs text-neutral-500 leading-relaxed mb-6 max-w-md mx-auto">
              Your grail sneakers have entered our temperature-controlled verification vault. Physical multi-point authentication starts immediately.
            </p>

            <div className="bg-neutral-50 rounded-2xl p-4 text-left border border-neutral-200/80 mb-6 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Total Paid:</span>
                <span className="font-bold text-neutral-900">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping Method:</span>
                <span className="font-bold text-neutral-900">
                  {shippingMethod === 'priority' ? 'Priority Vault Air Dispatch' : 'Standard Authenticated Express'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Delivery:</span>
                <span className="font-bold text-emerald-600">
                  {shippingMethod === 'priority' ? 'Tomorrow by 12:00 PM' : '2-4 Business Days'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsOrderConfirmed(false)
                  if (onNavigate) {
                    onNavigate('HOME')
                  } else {
                    navigate('/')
                  }
                }}
                className="flex-1 bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Return to Drops</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

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

      <main className="flex-1 pb-16">
        {/* Checkout Header with Stepper */}
        <CheckoutHeader
          currentStep={1}
          onNavigate={onNavigate}
        />

        {/* 2-Column Main Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Form details (Contact, Shipping Address, Shipping Method) */}
            <div className="lg:col-span-7 space-y-6">
              <ContactInformationCard
                email={contactInfo.email}
                phone={contactInfo.phone}
                onChange={setContactInfo}
                onLoginClick={() => onNavigate && onNavigate('LOGIN')}
              />

              <ShippingAddressCard
                initialAddress={shippingAddress}
                onChange={setShippingAddress}
              />

              <ShippingMethodCard
                selectedMethod={shippingMethod}
                onSelectMethod={(method) => {
                  setShippingMethod(method)
                  showToast(method === 'priority' ? 'Upgraded to Priority Vault Air Dispatch' : 'Selected Standard Authenticated Express')
                }}
              />
            </div>

            {/* Right 5 Columns: Order Breakdown, Payment Method, Anti-Counterfeit Policy */}
            <div className="lg:col-span-5 space-y-6">
              <OrderBreakdownCard
                items={items}
                shippingCost={shippingCost}
                onEditBag={() => onNavigate && onNavigate('CART')}
                onApplyPromo={(amount, code) => {
                  setDiscountAmount(amount)
                  showToast(`Promo ${code} applied: -$${amount}`)
                }}
              />

              <PaymentMethodCard
                totalAmount={totalAmount}
                onPlaceOrder={handlePlaceOrder}
              />

              <AntiCounterfeitPolicyCard />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to VIP drop updates!`)} />
    </div>
  )
}
