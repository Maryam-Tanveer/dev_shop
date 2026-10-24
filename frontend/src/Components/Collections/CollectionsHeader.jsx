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
        <span className="text-neutral-500">Shop Experience</span>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-800 font-semibold">Collections</span>
      </div>

      {/* Main Header & Vault Counter Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#fde8e8] text-[#c81d25] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3 border border-[#fecaca]">
            <Sparkles className="w-3 h-3 text-[#c81d25]" />
            <span>ARCHIVAL & IN-SEASON CURATION</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight mb-2.5">
            CURATED COLLECTIONS
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
            Explore authenticated sneaker drops, technical outerwear, archival basketball retros, and streetwear essentials curated by Dev Shop insiders.
          </p>
        </div>

        {/* Right Vault Units Counter */}
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-neutral-200/90 shadow-2xs self-start lg:self-auto flex-shrink-0">
          <div>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1">
              3,420+
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 block">
              VERIFIED UNITS IN VAULT
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
