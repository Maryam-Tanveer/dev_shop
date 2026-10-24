import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, Heart, ChevronDown, X } from 'lucide-react'
import { api } from '../services/api'
import { ALL_PRODUCTS as FALLBACK_PRODUCTS } from '../data/products'
import { NAV_LINKS } from '../data/navigation'
import { ROUTE_MAP } from '../hooks/useAppNavigate'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

export default function Navbar({
  cartCount: propCartCount,
  onOpenCart: propOnOpenCart,
  wishlistCount: propWishlistCount,
  searchQuery = '',
  onSearchChange,
  activeNav,
  onNavClick,
  onSelectProduct
}) {
  const navigate = useNavigate()
  const location = useLocation()
  let cartCtx = null
  try {
    cartCtx = useCart()
  } catch (e) {
    // fallback if outside provider
  }

  let authCtx = null
  try {
    authCtx = useAuth()
  } catch (e) {
    // fallback if outside provider
  }

  let wishlistCtx = null
  try {
    wishlistCtx = useWishlist()
  } catch (e) {
    // fallback if outside provider
  }

  const currentUser = authCtx?.currentUser

  const cartCount = propCartCount !== undefined ? propCartCount : (cartCtx?.cartCount ?? 0)
  const wishlistCount = propWishlistCount !== undefined ? propWishlistCount : (wishlistCtx?.wishlistCount ?? 0)
  const handleOpenCart = propOnOpenCart || cartCtx?.openDrawer
  const navLinks = NAV_LINKS
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef(null)

  // Dynamic API search query with backend endpoint
  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    let isMounted = true
    setIsSearching(true)
    const timer = setTimeout(() => {
      api
        .getProducts({ q })
        .then((items) => {
          if (isMounted) {
            setSearchResults(Array.isArray(items) ? items.slice(0, 5) : [])
          }
        })
        .catch(() => {
          if (isMounted) {
            const query = q.toLowerCase()
            const fallback = FALLBACK_PRODUCTS.filter(
              (p) =>
                p.title?.toLowerCase().includes(query) ||
                p.brand?.toLowerCase().includes(query) ||
                p.edition?.toLowerCase().includes(query)
            ).slice(0, 5)
            setSearchResults(fallback)
          }
        })
        .finally(() => {
          if (isMounted) setIsSearching(false)
        })
    }, 200)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchQuery])

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectSearchResult = (productId) => {
    if (onSelectProduct) {
      onSelectProduct(productId)
    } else {
      navigate(`/product/${productId}`)
    }
    setShowSearchDropdown(false)
    if (onSearchChange) onSearchChange('')
  }

  return (
    <>
      {/* 1. TOP BLACK UTILITY BAR */}
      <div className="bg-[#121212] text-neutral-300 text-[11px] font-semibold border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between">
          {/* Navigation Links */}
          <nav className="flex items-center gap-6 sm:gap-7 tracking-wider uppercase overflow-x-auto no-scrollbar">
            {navLinks.map((item) => {
              const routePath = ROUTE_MAP[item] || `/${item.toLowerCase()}`
              const isActive = activeNav ? activeNav === item : (item === 'HOME' ? location.pathname === '/' : location.pathname.startsWith(routePath))
              return (
                <Link
                  key={item}
                  to={routePath}
                  onClick={() => onNavClick && onNavClick(item)}
                  className={`transition-colors whitespace-nowrap relative py-0.5 ${
                    isActive
                      ? 'text-[#c81d25] font-extrabold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#c81d25]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item}
                </Link>
              )
            })}
          </nav>

          {/* Currency / Language */}
          <div className="hidden sm:flex items-center gap-4 text-neutral-400 font-medium">
            <button className="flex items-center gap-1 hover:text-white transition">
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <span className="text-neutral-700">|</span>
            <button className="flex items-center gap-1 hover:text-white transition">
              <span>USD</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
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

          {/* Search Bar with Autocomplete Dropdown */}
          <div ref={searchRef} className="flex-1 max-w-xl mx-auto hidden md:block relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value)
                  setShowSearchDropdown(true)
                }}
                placeholder='Try "Jordan 1", "Yeezy", "Snowboard", or "Panda"'
                className="w-full bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-white text-xs font-medium text-neutral-800 placeholder-neutral-400 pl-11 pr-8 py-2.5 rounded-full border border-transparent focus:border-neutral-300 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    if (onSearchChange) onSearchChange('')
                    setShowSearchDropdown(false)
                  }}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200/90 py-2 z-50 overflow-hidden">
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
                  Matching Drops ({searchResults.length})
                </div>
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSearchResult(item.id)}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#fcfbfa] text-left transition border-b last:border-0 border-neutral-100/60 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden border border-neutral-200">
                      <img
                        src={item.thumbnails?.[0]?.image || item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-[#c81d25] uppercase tracking-wider">
                        {item.brand}
                      </div>
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {item.title}
                      </div>
                    </div>
                    <div className="text-xs font-black text-neutral-900">
                      ${item.price?.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={() => onNavClick && onNavClick('WISHLIST')}
              className="p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-[#c81d25] transition relative"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-[#c81d25] fill-[#c81d25]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c81d25]" />
              )}
            </Link>

            {/* Cart Button Pill */}
            <button
              onClick={() => {
                if (handleOpenCart) {
                  handleOpenCart()
                } else if (onNavClick) {
                  onNavClick('CART')
                } else {
                  navigate('/cart')
                }
              }}
              className="bg-[#fde8e8] hover:bg-[#fad1d1] text-[#c81d25] px-4 py-2 rounded-full flex items-center gap-2.5 text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{cartCount} Items</span>
            </button>

            {/* User Profile Avatar / Sign In */}
            {currentUser ? (
              <Link
                to="/account"
                onClick={() => onNavClick && onNavClick('ACCOUNT')}
                title={`${currentUser.name} (${currentUser.tier || 'Member'})`}
                className="w-9 h-9 rounded-full overflow-hidden border border-neutral-300 hover:border-[#c81d25] transition cursor-pointer flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white font-extrabold text-[11px] shadow-2xs"
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
                className="bg-neutral-900 hover:bg-[#c81d25] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer"
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
