import { useState } from 'react'
import { Bookmark, ArrowRight, Target } from 'lucide-react'

export default function CollectionsFeaturedCapsule({
  featuredDrop,
  onDiscoverDrop,
  onSaveSeries
}) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    if (onSaveSeries) onSaveSeries(!isSaved)
  }

  const title = featuredDrop?.name
    ? `${featuredDrop.name} ${featuredDrop.edition || ''}`
    : 'THE TOKYO MINIMALIST FALL CAPSULE'

  const description =
    featuredDrop?.description ||
    'Engineered exclusively by Dev Shop Tokyo Creative Labs. Featuring heavyweight waterproof ripstop parkas, convertible cargo pants, and deadstock neutral runners assembled for autumn city movement.'

  const price = featuredDrop?.retailPrice || 390
  const image = featuredDrop?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
      <div className="bg-[#f5f3ee] rounded-3xl p-6 sm:p-10 lg:p-12 border border-neutral-200/90 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Info & Stats */}
          <div className="lg:col-span-6 space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#fde8e8] text-[#c81d25] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-[#fecaca]">
              <Target className="w-3.5 h-3.5 text-[#c81d25]" />
              <span>CURATOR'S PICK</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight leading-tight uppercase">
              {title}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {description}
            </p>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#c81d25] leading-none mb-1">
                  18
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  SILHOUETTES
                </span>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-neutral-900 leading-none mb-1">
                  100%
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  DEADSTOCK
                </span>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-neutral-900 leading-none mb-1">
                  48h
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  EARLY ACCESS
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onDiscoverDrop && onDiscoverDrop(featuredDrop)}
                className="bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
              >
                <span>Discover the Fall Drop</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button
                onClick={handleSave}
                className="bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold px-5 py-3.5 rounded-full border border-neutral-300 shadow-2xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#c81d25] text-[#c81d25]' : 'text-neutral-600'}`} />
                <span>{isSaved ? 'Series Saved' : 'Save Series'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Showcase with Floating Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-neutral-300/80 bg-neutral-900 h-[380px] sm:h-[420px]">
              {/* Photo Collage Preview */}
              <div className="grid grid-cols-2 h-full gap-1">
                <img
                  src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
                  alt="Tokyo Streetwear Model"
                  className="w-full h-full object-cover"
                />
                <img
                  src={image}
                  alt="Runner Close Up"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Pill Tag at Bottom */}
              <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/80 shadow-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center font-black text-xs text-neutral-800 flex-shrink-0">
                    01
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-neutral-900 truncate">
                      {featuredDrop?.name ? `${featuredDrop.name} ${featuredDrop.edition || ''}` : 'Shibuya Urban Stealth Kit'}
                    </h4>
                    <p className="text-[10px] text-neutral-500 truncate">
                      Limited to 250 numbered units worldwide
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-black text-[#c81d25]">
                    ${price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
