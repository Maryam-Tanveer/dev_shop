import { Link } from 'react-router-dom'
import { Sparkles, Clock } from 'lucide-react'

export default function CollectionsHeader({ onBackToHome }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full">
      {/* Top Breadcrumb */}
      <div className="text-[11px] text-neutral-400 font-medium mb-4">
        <Link
          to="/"
          onClick={onBackToHome}
          className="hover:text-neutral-700 transition"
        >
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-900 font-bold">Collections</span>
      </div>

      {/* Main Header & Product Counter Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="max-w-2xl">
          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight mb-2.5">
            Curated Collections
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
            Explore authentic sneaker releases, technical outerwear, classic retros, and premium streetwear essentials.
          </p>
        </div>

        {/* Right Units Counter */}
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-neutral-200/90 shadow-2xs self-start lg:self-auto flex-shrink-0">
          <div>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1">
              3,420+
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 block">
              Curated Products
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
