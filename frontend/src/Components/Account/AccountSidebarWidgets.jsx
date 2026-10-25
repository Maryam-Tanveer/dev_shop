import { MapPin, CreditCard, Heart, Shield, Lock, Bell, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AccountSidebarWidgets({
  onEditShipping,
  onManagePayment,
  onViewWishlist,
  onExploreTierPerks,
  onAddCard
}) {
  let auth = null
  try {
    auth = useAuth()
  } catch (e) {
    // fallback outside provider
  }
  const currentUser = auth?.currentUser
  const recipientName = currentUser?.name || 'Dev Shop Member'
  const defaultAddr = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0]
  const streetLine = defaultAddr?.address || defaultAddr?.streetAddress || '482 Mercer Street'
  const aptLine = defaultAddr?.apartment || 'Loft 3B'
  const cityStateZip = [defaultAddr?.city || 'New York', defaultAddr?.state || 'NY', defaultAddr?.zipCode || defaultAddr?.postalCode || '10013'].filter(Boolean).join(', ')
  const countryLine = defaultAddr?.country || 'United States'
  const phoneLine = currentUser?.phone || '+1 (212) 840-9124'
  const secondaryCount = Math.max(0, (currentUser?.addresses?.length || 1) - 1)

  return (
    <div className="space-y-6">
      {/* 1. Primary Shipping */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#c81d25]" />
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
              Primary Shipping
            </h3>
          </div>
          <button
            onClick={onEditShipping}
            className="text-xs font-bold text-[#c81d25] hover:underline cursor-pointer"
          >
            Edit
          </button>
        </div>

        <div className="text-xs text-neutral-600 space-y-1 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-neutral-900">{recipientName}</span>
            <span className="bg-rose-50 text-[#c81d25] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-200">
              DEFAULT
            </span>
          </div>
          <p>{streetLine}</p>
          {aptLine && <p>{aptLine}</p>}
          <p>{cityStateZip}</p>
          <p>{countryLine}</p>
          <p className="pt-1 text-neutral-500 font-medium">{phoneLine}</p>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-3 border-t border-neutral-100 text-neutral-500">
          <span>{secondaryCount > 0 ? `${secondaryCount} Secondary address(es) saved` : 'Default verified address'}</span>
          <button
            onClick={onEditShipping}
            className="text-[#c81d25] font-bold hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>
      </div>

      {/* 2. Payment Methods */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#c81d25]" />
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
              Payment Methods
            </h3>
          </div>
          <button
            onClick={onManagePayment}
            className="text-xs font-bold text-[#c81d25] hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>

        {/* Black QuickPass Card Mockup */}
        <div className="bg-[#121212] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-neutral-800 relative overflow-hidden mb-3">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400">
              DEV SHOP QUICKPASS
            </span>
            <span className="text-xs font-black italic tracking-wider text-white">
              VISA
            </span>
          </div>

          <div className="text-base sm:text-lg font-mono font-bold tracking-widest text-neutral-100 mb-6">
            •••• •••• •••• 8821
          </div>

          <div className="flex items-end justify-between text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            <div>
              <span className="block text-[8px] text-neutral-500">CARDHOLDER</span>
              <span className="text-white">{recipientName.toUpperCase()}</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] text-neutral-500">EXPIRES</span>
              <span className="text-white">09/28</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 text-neutral-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#c81d25]" />
            <span>Tokenized 256-Bit SSL</span>
          </span>
          <button
            onClick={onAddCard}
            className="text-[#c81d25] font-bold hover:underline"
          >
            + Add Card
          </button>
        </div>
      </div>

      {/* 3. Wishlist Quick Peek */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#c81d25]" />
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
              Wishlist Quick Peek
            </h3>
          </div>
          <button
            onClick={onViewWishlist}
            className="text-xs font-bold text-[#c81d25] hover:underline"
          >
            View All (4 Items)
          </button>
        </div>

        {/* 3 Sneaker Thumbnails Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          {/* Sneaker 1 */}
          <div className="bg-neutral-50 rounded-xl p-2 border border-neutral-100 text-center">
            <div className="h-14 flex items-center justify-center mb-1">
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=150&q=80"
                alt="Dunk Low Panda"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-[10px] font-bold text-neutral-800 block truncate">
              Dunk Low Pa...
            </span>
            <span className="text-[10px] font-black text-[#c81d25]">
              $120
            </span>
          </div>

          {/* Sneaker 2 */}
          <div className="bg-neutral-50 rounded-xl p-2 border border-neutral-100 text-center">
            <div className="h-14 flex items-center justify-center mb-1">
              <img
                src="https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=150&q=80"
                alt="NB 990v6 Grey"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-[10px] font-bold text-neutral-800 block truncate">
              NB 990v6 Gr...
            </span>
            <span className="text-[10px] font-black text-[#c81d25]">
              $210
            </span>
          </div>

          {/* Sneaker 3 */}
          <div className="bg-neutral-50 rounded-xl p-2 border border-neutral-100 text-center">
            <div className="h-14 flex items-center justify-center mb-1">
              <img
                src="https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=150&q=80"
                alt="AJ4 Military"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-[10px] font-bold text-neutral-800 block truncate">
              AJ4 Military
            </span>
            <span className="text-[10px] font-black text-[#c81d25]">
              $225
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 text-neutral-500">
          <span className="flex items-center gap-1">
            <Bell className="w-3 h-3 text-neutral-400" />
            <span>Restock notifications on</span>
          </span>
          <span className="font-bold text-neutral-700">3/4 Items</span>
        </div>
      </div>

      {/* 4. Vault Benefits */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#c81d25]" />
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
              Vault Benefits
            </h3>
          </div>
          <span className="bg-[#c81d25] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
            LEVEL 3
          </span>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed mb-4">
          You are 550 points away from unlocking <strong className="text-neutral-900">Apex Collector Status</strong> with guaranteed zero-queue checkout and personal stylist consultation.
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
            <span>PROGRESS: 2,450 / 3,000 PTS</span>
            <span className="text-[#c81d25]">81%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#c81d25] rounded-full w-[81%]" />
          </div>
        </div>

        <button
          type="button"
          onClick={onExploreTierPerks}
          className="w-full bg-[#fcfbfa] hover:bg-neutral-100 text-neutral-900 text-xs font-bold py-2.5 px-4 rounded-full border border-neutral-200 transition shadow-2xs flex items-center justify-center gap-2 active:scale-95"
        >
          <span>Explore Vault Tier Perks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
