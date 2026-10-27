import { useEffect, lazy, Suspense } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
} from 'react-router-dom'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'

// React.lazy Route Code-Splitting: Only downloads chunk for active route
const LandingPage = lazy(() => import('./Pages/Landing/LandingPage'))
const LoginPage = lazy(() => import('./Pages/Auth/LoginPage'))
const ProductDetailsPage = lazy(() => import('./Pages/Product/ProductDetailsPage'))
const WishlistPage = lazy(() => import('./Pages/Wishlist/WishlistPage'))
const CartPage = lazy(() => import('./Pages/Cart/CartPage'))
const FaqPage = lazy(() => import('./Pages/Faq/FaqPage'))
const BlogPage = lazy(() => import('./Pages/Blog/BlogPage'))
const CollectionsPage = lazy(() => import('./Pages/Collections/CollectionsPage'))
const CheckoutPage = lazy(() => import('./Pages/Checkout/CheckoutPage'))
const ProductsCatalogPage = lazy(() => import('./Pages/Product/ProductsCatalogPage'))
const DashboardPage = lazy(() => import('./Pages/Account/DashboardPage'))
const OrderConfirmationPage = lazy(() => import('./Pages/Order/OrderConfirmationPage'))
const AdminPage = lazy(() => import('./Pages/Admin/AdminPage'))
const NotFoundPage = lazy(() => import('./Pages/NotFound/NotFoundPage'))

// Automatically scrolls window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

// Fallback loader while lazy chunk downloads
function PageFallbackLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="min-h-screen bg-[#0e0e11] text-white flex flex-col items-center justify-center p-6"
    >
      <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#c81d25] rounded-full animate-spin mb-4" aria-hidden="true" />
      <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 animate-pulse">
        ACCESSING VAULT TELEMETRY...
      </span>
    </div>
  )
}

// Wrapper for ProductDetailsPage to dynamically read :id from URL parameter
function ProductDetailsRouteWrapper() {
  const { id } = useParams()
  if (!id) {
    return (
      <NotFoundPage
        title="404 - Product Not Specified"
        message="No product ID was provided in the URL. Please select an allocation from our catalog."
      />
    )
  }
  return <ProductDetailsPage productId={id} />
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallbackLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsCatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailsRouteWrapper />} />
        <Route
          path="/product"
          element={
            <NotFoundPage
              title="404 - No Product Specified"
              message="No product ID was provided in the URL. Please explore our drop catalog below to choose an item."
            />
          }
        />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* 404 / Catch-all route renders NotFoundPage */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
