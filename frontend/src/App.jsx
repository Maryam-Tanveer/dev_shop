import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
} from 'react-router-dom'
import LandingPage from './Pages/Landing/LandingPage'
import LoginPage from './Pages/Auth/LoginPage'
import ProductDetailsPage from './Pages/Product/ProductDetailsPage'
import WishlistPage from './Pages/Wishlist/WishlistPage'
import CartPage from './Pages/Cart/CartPage'
import FaqPage from './Pages/Faq/FaqPage'
import BlogPage from './Pages/Blog/BlogPage'
import CollectionsPage from './Pages/Collections/CollectionsPage'
import CheckoutPage from './Pages/Checkout/CheckoutPage'
import ProductsCatalogPage from './Pages/Product/ProductsCatalogPage'
import DashboardPage from './Pages/Account/DashboardPage'
import OrderConfirmationPage from './Pages/Order/OrderConfirmationPage'
import AdminPage from './Pages/Admin/AdminPage'
import NotFoundPage from './Pages/NotFound/NotFoundPage'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'

// Automatically scrolls window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
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
