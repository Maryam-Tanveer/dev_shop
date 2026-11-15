import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart } from 'lucide-react'
import { NAV_LINKS } from '../data/navigation'
import { ROUTE_MAP } from '../hooks/useAppNavigate'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

export default function Navbar({
  cartCount: propCartCount,
  onOpenCart: propOnOpenCart,
  wishlistCount: propWishlistCount,
  searchQuery,
  onSearchChange,
  activeNav,
  onNavClick,
  onSelectProduct
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const cartCtx = useCart()
  const authCtx = useAuth()
  const wishlistCtx = useWishlist()

  const currentUser = authCtx?.currentUser

  const cartCount = propCartCount !== undefined ? propCartCount : (cartCtx?.cartCount ?? 0)
  const wishlistCount = propWishlistCount !== undefined ? propWishlistCount : (wishlistCtx?.wishlistCount ?? 0)
  const handleOpenCart = propOnOpenCart || cartCtx?.openDrawer
  const navLinks = NAV_LINKS

  return (
    <>
      {/* 1. TOP BLACK UTILITY BAR */}
      <div className="bg-[#121212] text-neutral-300 text-[11px] font-semibold border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2.5 flex items-center">
          {/* Navigation Links */}
          <nav aria-label="Main navigation" className="flex items-center gap-6 sm:gap-7 tracking-wider uppercase overflow-x-auto overflow-y-hidden no-scrollbar">
            {navLinks.map((item) => {
              const routePath = ROUTE_MAP[item] || `/${item.toLowerCase()}`
              const isActive = activeNav ? activeNav === item : (item === 'HOME' ? location.pathname === '/' : location.pathname.startsWith(routePath))
              return (
                <Link
                  key={item}
                  to={routePath}
                  onClick={() => onNavClick && onNavClick(item)}
                  className={`transition-colors whitespace-nowrap relative py-1 ${
                    isActive
                      ? 'text-[#c81d25] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c81d25]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <header className="bg-white border-b border-neutral-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-8">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => onNavClick && onNavClick('HOME')}
            className="flex items-center gap-2 group flex-shrink-0 text-left"
          >
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-1.5 rounded-full bg-[#c81d25]"></span>
              <span className="w-2.5 h-1.5 rounded-full bg-[#c81d25]"></span>
            </div>
            <span className="font-black text-xl tracking-tight text-[#111111] group-hover:text-[#c81d25] transition">
              DEV SHOP
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={() => onNavClick && onNavClick('WISHLIST')}
              aria-label={`View wishlist, ${wishlistCount} items`}
              className="p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-[#c81d25] transition relative"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-[#c81d25] fill-[#c81d25]' : ''}`} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c81d25]" aria-hidden="true" />
              )}
            </Link>

            {/* Cart Button Pill */}
            <button
              type="button"
              onClick={() => {
                if (handleOpenCart) {
                  handleOpenCart()
                } else if (onNavClick) {
                  onNavClick('CART')
                } else {
                  navigate('/cart')
                }
              }}
              aria-label={`Open shopping cart drawer, ${cartCount} items`}
              className="bg-[#fde8e8] hover:bg-[#fad1d1] text-[#c81d25] px-4 py-2 rounded-full flex items-center gap-2.5 text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>{cartCount} Items</span>
            </button>

            {/* User Profile Avatar / Sign In */}
            {currentUser ? (
              <Link
                to="/account"
                onClick={() => onNavClick && onNavClick('ACCOUNT')}
                aria-label={`View account profile for ${currentUser.name || 'Member'}`}
                title={`${currentUser.name} (${currentUser.tier || 'Member'})`}
                className={`w-9 h-9 rounded-full overflow-hidden border transition cursor-pointer flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white font-extrabold text-[11px] shadow-2xs ${
                  location.pathname === '/account' || activeNav === 'ACCOUNT'
                    ? 'border-[#c81d25] ring-2 ring-[#c81d25]/40'
                    : 'border-neutral-300 hover:border-[#c81d25]'
                }`}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {currentUser.name
                      ? currentUser.name
                          .trim()
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'DS'}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => onNavClick && onNavClick('LOGIN')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer ${
                  location.pathname === '/login' || activeNav === 'LOGIN'
                    ? 'bg-[#c81d25] text-white ring-2 ring-[#c81d25]/30'
                    : 'bg-neutral-900 hover:bg-[#c81d25] text-white'
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
