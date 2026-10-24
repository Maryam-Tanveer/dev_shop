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

        {/* Right Curators Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 flex items-center gap-4 shadow-2xs self-start lg:self-auto flex-shrink-0">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-0.5">
              ACTIVE WRITERS
            </span>
            <div className="text-lg font-black text-neutral-900 leading-none">
              14 Curators
            </div>
          </div>

          {/* Overlapping Avatar Stack */}
          <div className="flex items-center -space-x-2.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Curator 1"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-2xs"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
              alt="Curator 2"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-2xs"
            />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
              alt="Curator 3"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-2xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
