import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function BlogHeader({ onBackToHome }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-4 w-full">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium mb-5">
        <Home className="w-3.5 h-3.5 text-neutral-400" />
        <Link
          to="/"
          onClick={onBackToHome}
          className="hover:text-neutral-700 transition"
        >
          Home
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-700 font-semibold">Blog</span>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="max-w-2xl">
          {/* Label */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#c81d25] animate-pulse"></span>
            <span className="text-[#c81d25] text-[11px] font-black uppercase tracking-wider">
              THE DEV SHOP EDITORIAL JOURNAL
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight mb-3 uppercase">
            BLOGS POSTS
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
            Unpacking global sneaker culture, archival silhouette breakdowns, verified drop forensics, and avant-garde streetwear editorials curated by tastemakers and industry insiders.
          </p>
        </div>
      </div>
    </div>
  )
}
