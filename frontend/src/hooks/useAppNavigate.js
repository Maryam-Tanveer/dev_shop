import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

export const ROUTE_MAP = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: '/products',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation',
  CONFIRMATION: '/order-confirmation',
  ACCOUNT: '/account',
  DASHBOARD: '/account',
  COLLECTIONS: '/collections',
  BLOG: '/blog',
  FAQ: '/faq',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
}

export function useAppNavigate() {
  const navigate = useNavigate()

  const goTo = useCallback(
    (destination) => {
      if (!destination) return
      if (typeof destination === 'string' && (destination.startsWith('/') || destination.startsWith('?'))) {
        navigate(destination)
        return
      }
      const mapped = ROUTE_MAP[destination] || (destination ? `/${destination.toLowerCase()}` : '/')
      navigate(mapped)
    },
    [navigate]
  )

  const selectProduct = useCallback(
    (productId) => {
      if (productId) {
        navigate(`/product/${productId}`)
      } else {
        navigate('/products')
      }
    },
    [navigate]
  )

  return { navigate, goTo, selectProduct }
}

export default useAppNavigate
