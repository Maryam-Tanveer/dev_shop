import { ShieldCheck, TrendingDown, Zap } from 'lucide-react'

export default function WishlistPerksBanner() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 w-full">
      <div className="bg-[#1f1f23] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800/80 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Perk 1 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white border border-white/10">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white mb-1.5">
                100% Verified Authentic
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
                Every sneaker passing through Dev Shop undergoes strict physical authentication and condition verification.
              </p>
            </div>
          </div>

          {/* Perk 2 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white border border-white/10">
              <TrendingDown className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white mb-1.5">
                Instant Price Drop Ping
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
                We continuously monitor market prices and notify you the moment your wishlisted silhouette hits a lower price point.
              </p>
            </div>
          </div>

          {/* Perk 3 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white border border-white/10">
              <Zap className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white mb-1.5">
                Exclusive Priority Access
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
                Wishlisted drops grant you a 15-minute priority queue check-out window before public raffle draw release.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
