import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Truck, CreditCard, RotateCcw, ShieldCheck } from 'lucide-react'
import { api } from '../../services/api'
import { FAQ_CATEGORIES as FALLBACK_CATEGORIES } from '../../data/faq'

const iconMap = {
  shipping: Truck,
  payments: CreditCard,
  returns: RotateCcw,
  authentication: ShieldCheck,
}

export default function FaqHero({
  activeCategory = 'shipping',
  onSelectCategory,
  onBackToHome
}) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)

  useEffect(() => {
    let isMounted = true
    api
      .getFaqs()
      .then((res) => {
        if (isMounted && res && Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories)
        }
      })
      .catch((err) => {
        console.error('Failed to load FAQ categories from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-6 w-full text-center flex flex-col items-center">
      {/* Top Breadcrumb */}
      <div className="w-full text-left text-[11px] text-neutral-400 font-medium mb-8">
        <Link
          to="/"
          onClick={onBackToHome}
          className="hover:text-neutral-700 transition"
        >
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-600 font-semibold">Shop Experience</span>
      </div>

      {/* Small Badge */}
      <div className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-600 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-neutral-200/80 mb-3 tracking-widest">
        <HelpCircle className="w-3.5 h-3.5 text-[#c81d25]" />
        <span>SUPPORT KNOWLEDGE BASE</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight mb-3">
        Frequently Asked Questions
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed mb-8">
        Find quick answers to common questions about sneaker authentication, shipping speeds, sizing, orders, and returns.
      </p>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon || iconMap[cat.id] || HelpCircle
          const isActive = activeCategory === cat.id

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs ${
                isActive
                  ? 'bg-[#b91c1c] text-white shadow-sm'
                  : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 border border-neutral-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
