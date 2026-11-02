import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, Heart, ChevronDown, X, Loader2, ArrowRight } from 'lucide-react'
import { api } from '../services/api'
import { NAV_LINKS } from '../data/navigation'
import { ROUTE_MAP } from '../hooks/useAppNavigate'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

const POPULAR_SUGGESTIONS = ['Jordan 1', 'Yeezy', 'Snowboard', 'Nike', 'New Balance']

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

  // Search States
  const [localQuery, setLocalQuery] = useState(searchQuery || '')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  // Sync internal state when external prop changes
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== localQuery) {
      setLocalQuery(searchQuery)
    }
  }, [searchQuery])

  // Dynamic API search query with backend endpoint
  useEffect(() => {
    const q = localQuery.trim()
    if (q.length < 1) {
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
            setSearchResults(Array.isArray(items) ? items.slice(0, 6) : [])
          }
        })
        .catch((err) => {
          console.error('Search API error:', err)
          if (isMounted) setSearchResults([])
        })
        .finally(() => {
          if (isMounted) setIsSearching(false)
        })
    }, 180)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [localQuery])

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        (!mobileSearchRef.current || !mobileSearchRef.current.contains(event.target))
      ) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (val) => {
    setLocalQuery(val)
    if (onSearchChange) onSearchChange(val)
    setShowSearchDropdown(true)
  }

  const handleClearSearch = () => {
    setLocalQuery('')
    if (onSearchChange) onSearchChange('')
    setSearchResults([])
    setShowSearchDropdown(false)
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    const q = localQuery.trim()
    setShowSearchDropdown(false)
    setShowMobileSearch(false)
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`)
    } else {
      navigate('/products')
    }
  }

  const handleSelectSearchResult = (productId) => {
    setShowSearchDropdown(false)
    setShowMobileSearch(false)
    if (onSelectProduct) {
      onSelectProduct(productId)
    } else {
      navigate(`/product/${productId}`)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleInputChange(suggestion)
    setShowSearchDropdown(true)
  }

  return (
    <>
      {/* 1. TOP BLACK UTILITY BAR */}
      <div className="bg-[#121212] text-neutral-300 text-[11px] font-semibold border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between">
          {/* Navigation Links */}
          <nav aria-label="Main navigation" className="flex items-center gap-6 sm:gap-7 tracking-wider uppercase overflow-x-auto no-scrollbar">
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
            <button type="button" aria-label="Select language" className="flex items-center gap-1 hover:text-white transition cursor-pointer">
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <span className="text-neutral-700" aria-hidden="true">|</span>
            <button type="button" aria-label="Select currency" className="flex items-center gap-1 hover:text-white transition cursor-pointer">
              <span>USD</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
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

          {/* Desktop Search Bar with Autocomplete Dropdown */}
          <div ref={searchRef} className="flex-1 max-w-xl mx-auto hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute left-3.5 text-neutral-400 hover:text-[#c81d25] transition cursor-pointer"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#c81d25]" />
                ) : (
                  <Search className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
              <input
                type="text"
                value={localQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setShowSearchDropdown(false)
                }}
                aria-label="Search streetwear drops by title or brand"
                placeholder='Try "Jordan 1", "Yeezy", "Snowboard", or "Panda"'
                className="w-full bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-white text-xs font-medium text-neutral-800 placeholder-neutral-400 pl-11 pr-9 py-2.5 rounded-full border border-transparent focus:border-neutral-300 outline-none transition shadow-2xs"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search query"
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </form>

            {/* Live Search Dropdown */}
            {showSearchDropdown && localQuery.trim().length > 0 && (
              <div
                role="listbox"
                aria-label="Search suggestions"
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200/90 py-2 z-50 overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-100 flex items-center justify-between">
                  <span>
                    {isSearching
                      ? 'Searching Vault...'
                      : `Matching Drops (${searchResults.length})`}
                  </span>
                  {localQuery && (
                    <span className="text-[10px] font-medium text-neutral-400">
                      Press Enter to search
                    </span>
                  )}
                </div>

                {/* Results list */}
                {searchResults.length > 0 ? (
                  <>
                    <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100/70">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSearchResult(item.id)}
                          className="w-full px-4 py-2.5 flex items-center gap-3.5 hover:bg-neutral-50 text-left transition group cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-xl bg-neutral-100 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden border border-neutral-200/80 group-hover:border-[#c81d25]/40 transition">
                            <img
                              src={item.thumbnails?.[0]?.image || item.image}
                              alt={item.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-extrabold text-[#c81d25] uppercase tracking-wider">
                              {item.brand || 'Dev Shop Drop'}
                            </div>
                            <div className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#c81d25] transition">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              {item.category || 'Sneakers'}
                            </div>
                          </div>
                          <div className="text-xs font-black text-neutral-900">
                            ${Number(item.price || 0).toFixed(2)}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* View all results button */}
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-xs font-bold text-[#c81d25] flex items-center justify-center gap-2 border-t border-neutral-100 transition cursor-pointer"
                    >
                      <span>View all drops for &ldquo;{localQuery}&rdquo;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : !isSearching ? (
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-neutral-700 mb-1">
                      No drops found for &ldquo;{localQuery}&rdquo;
                    </p>
                    <p className="text-[11px] text-neutral-400 mb-3">
                      Try searching for one of our trending drops:
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {POPULAR_SUGGESTIONS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSuggestionClick(term)}
                          className="text-[11px] font-semibold bg-neutral-100 hover:bg-[#c81d25] hover:text-white px-2.5 py-1 rounded-full text-neutral-700 transition cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileSearch((prev) => !prev)}
              aria-label="Toggle mobile search"
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-[#c81d25] transition cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
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

        {/* Mobile Search Bar Dropdown */}
        {showMobileSearch && (
          <div ref={mobileSearchRef} className="md:hidden px-4 pb-3 pt-2 border-t border-neutral-100 bg-white">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={localQuery}
                autoFocus
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder='Search "Jordan", "Yeezy", "Nike"...'
                className="w-full bg-[#f4f4f4] text-xs font-medium text-neutral-800 placeholder-neutral-400 pl-10 pr-9 py-2.5 rounded-full outline-none border border-transparent focus:border-neutral-300"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 text-neutral-400 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile Autocomplete Suggestions */}
            {localQuery.trim().length > 0 && searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden divide-y divide-neutral-100 max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSearchResult(item.id)}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-left hover:bg-neutral-50 transition cursor-pointer"
                  >
                    <img
                      src={item.thumbnails?.[0]?.image || item.image}
                      alt={item.title}
                      className="w-9 h-9 rounded-lg object-contain bg-neutral-100 p-0.5 border border-neutral-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-neutral-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-[9px] text-[#c81d25] font-bold uppercase">
                        {item.brand}
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-neutral-900">
                      ${Number(item.price || 0).toFixed(2)}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full py-2 bg-neutral-50 text-[11px] font-bold text-[#c81d25] text-center cursor-pointer"
                >
                  View all drops for &ldquo;{localQuery}&rdquo; →
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  )
}
