import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, ArrowRight, ShieldCheck, Zap, Ticket, ArrowUpRight } from 'lucide-react'
import { api } from '../../services/api'

export default function HeroSection({ onAddToCart, onEventDetails, onSelectProduct }) {
  const navigate = useNavigate()
  const [heroDrop, setHeroDrop] = useState(null)

  useEffect(() => {
    let isMounted = true
    api
      .getHeroDrop()
      .then((data) => {
        if (isMounted && data) {
          setHeroDrop(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load hero drop from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const heroProductId = heroDrop?.productId || heroDrop?.id

  const handleSelect = (productId) => {
    if (onSelectProduct) {
      onSelectProduct(productId)
    } else if (productId) {
      navigate(`/product/${productId}`)
    }
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT LARGE HERO CARD (8 Cols) */}
        <div className="lg:col-span-8 bg-[#f5f2eb] rounded-2xl border border-[#e8e3d8] p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[420px]">
          <div>
            {/* New Arrival Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#fde8e8] text-[#c81d25] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mb-4 border border-[#fecaca]">
              <Flame className="w-3.5 h-3.5 fill-[#c81d25]" />
              <span>{heroDrop?.badge || 'NEW ARRIVAL!'}</span>
            </div>

            {/* Title & Description Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-7 z-10">
                <h1
                  onClick={() => heroProductId && handleSelect(heroProductId)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] leading-[1.08] tracking-tight cursor-pointer hover:text-[#c81d25] transition"
                >
                  {heroDrop?.name || 'AIR JORDAN 6'} <br />
                  <span className="text-[#c81d25]">{heroDrop?.edition || 'GX EASTSIDE'}</span>
                </h1>

                <p className="text-xs sm:text-sm text-neutral-600 mt-3.5 max-w-sm leading-relaxed font-normal">
                  {heroDrop?.description || 'Elevated suede overlays meet championship heritage detailing.'}
                </p>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      if (heroProductId) {
                        handleSelect(heroProductId)
                      } else if (onAddToCart && heroDrop) {
                        onAddToCart({
                          id: heroProductId,
                          productId: heroProductId,
                          brand: 'JORDAN RETRO',
                          title: `${heroDrop.name} ${heroDrop.edition}`,
                          price: heroDrop.retailPrice || 210,
                          image: heroDrop.image
                        })
                      }
                    }}
                    className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <span>View Product</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Authenticity Pill */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 bg-white/80 border border-neutral-300/80 text-neutral-700 text-[10px] font-semibold px-3 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Genuine Certified</span>
                  </span>
                </div>
              </div>

              {/* Sneaker Hero Image Showcase */}
              <div className="md:col-span-5 relative flex items-center justify-center mt-4 md:mt-0">
                <div
                  onClick={() => onSelectProduct && heroProductId && onSelectProduct(heroProductId)}
                  className="relative group cursor-pointer"
                >
                  {/* Shadow base */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/15 rounded-full blur-md" />

                  {/* Image with boxes mockup */}
                  <div className="relative rounded-xl overflow-hidden border border-[#ded8cb] shadow-lg bg-neutral-200 w-full max-w-[280px]">
                    <img
                      src={heroDrop.image}
                      alt={heroDrop.name}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Retail Drop Tag */}
                  <div className="absolute -bottom-3 right-2 bg-white border border-neutral-200/90 rounded-full px-3 py-1 text-[11px] font-extrabold text-neutral-900 shadow-md flex items-center gap-1.5 group-hover:border-[#c81d25] transition">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25]"></span>
                    <span>Retail Drop: $210</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Series Strip */}
          <div className="pt-6 mt-6 border-t border-[#e2dcd0] flex items-center justify-between text-xs font-medium text-neutral-500">
            <div>
              <span>Series 05 • Edition of 1,200 Pairs</span>
            </div>
            <div className="font-extrabold text-neutral-900 tracking-wider uppercase text-[11px]">
              IN VAULT TODAY
            </div>
          </div>
        </div>

        {/* RIGHT HERO CARD (4 Cols): Sneakers Fest Special Pass */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#c81d25] via-[#b91c1c] to-[#881337] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-lg min-h-[420px]">
          {/* Background lightning bolt watermark */}
          <div className="absolute top-2 right-2 text-white/10 pointer-events-none select-none">
            <Zap className="w-36 h-36" />
          </div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-xs">
              <Ticket className="w-3 h-3" />
              <span>SPECIAL PASS</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mt-4 uppercase">
              DISC UP TO 50% FOR SNEAKERS FEST ID 2023
            </h2>

            {/* Description */}
            <p className="text-xs text-white/80 mt-3 leading-relaxed">
              Exclusive cultural showcase ticket perks, archive deadstock releases, and daily giveaway draws for all registered members.
            </p>

            {/* Allocation Cap Meter Box */}
            <div className="bg-black/25 border border-white/15 rounded-xl p-3.5 flex items-center gap-3.5 my-6 backdrop-blur-xs">
              {/* Circular Gauge */}
              <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center font-extrabold text-xs text-white flex-shrink-0">
                82%
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                  ALLOCATION CAP
                </div>
                <div className="text-xs font-extrabold text-white">
                  Tier-1 Passes Claimed
                </div>
              </div>
            </div>
          </div>

          {/* Event CTA Button */}
          <div className="relative z-10">
            <button
              onClick={() => onEventDetails && onEventDetails()}
              className="w-full bg-white hover:bg-neutral-100 text-[#b91c1c] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-full text-center transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <span>Event details</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
