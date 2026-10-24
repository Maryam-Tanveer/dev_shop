import { Mail, Settings, Shield, Package, Heart, MapPin, Award, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AccountProfileHero({
  onOpenVaultPass,
  onOpenPreferences,
  onSignOut,
}) {
  const { currentUser, logout, isAuthenticated } = useAuth()

  const displayName = currentUser?.name || 'Guest Collector'
  const displayEmail = currentUser?.email || 'guest@devshop.io'
  const displayTier = currentUser?.tier || 'VAULT ROOKIE'
  const displayJoined = currentUser?.joined ? `Member since ${currentUser.joined}` : 'Guest Session'
  const hasAvatar = !!currentUser?.avatar

  const getInitials = (name) => {
    if (!name) return 'DS'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const handleLogout = () => {
    logout()
    if (onSignOut) {
      onSignOut()
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs mb-6">
      {/* Top Profile Info Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar with Status Dot */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-neutral-200 shadow-xs flex items-center justify-center bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white font-black text-xl sm:text-2xl">
              {hasAvatar ? (
                <img
                  src={currentUser.avatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>
            {/* Status Dot */}
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#c81d25] border-2 border-white flex items-center justify-center text-[10px] text-white shadow-2xs">
              ✓
            </span>
          </div>

          {/* Name & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {displayName}
              </h1>
              <span className="bg-[#c81d25] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                {displayTier}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mb-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>{displayEmail}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-neutral-500">
              <span className="text-[#c81d25] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25]" />
                PRIORITY DROP ACCESS: {currentUser?.priorityAccess ? 'ACTIVE' : 'STANDARD'}
              </span>
              <span className="text-neutral-300">•</span>
              <span>{displayJoined}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <button
            type="button"
            onClick={onOpenVaultPass}
            className="bg-[#121212] hover:bg-neutral-800 text-white text-xs font-extrabold px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#c81d25]" />
            <span>Vault Pass</span>
          </button>

          <button
            type="button"
            onClick={onOpenPreferences}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 sm:px-5 py-2.5 rounded-full border border-neutral-200 flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-600" />
            <span>Preferences</span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-[#c81d25] text-xs font-bold px-4 py-2.5 rounded-full border border-rose-200 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Counters Grid (4 Cols) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        {/* Stat 1 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25] flex-shrink-0">
            <Package className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-neutral-900 leading-none">
              14
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Orders Placed
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25] flex-shrink-0">
            <Heart className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-neutral-900 leading-none">
              4
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Wishlist Items
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25] flex-shrink-0">
            <MapPin className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-neutral-900 leading-none">
              3
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Saved Addresses
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25] flex-shrink-0">
            <Award className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-[#c81d25] leading-none">
              2,450 <span className="text-xs font-bold text-neutral-500">PTS</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Dev Points Balance
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
