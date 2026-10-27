export default function AdminAccessDenied({ currentUser, onLogin, onReturnHome }) {
  const isGuest = !currentUser

  return (
    <div
      role="alert"
      aria-live="polite"
      className="max-w-md mx-auto my-16 bg-[#16161f] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden backdrop-blur-xl"
    >
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c81d25]/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#c81d25] to-neutral-900 flex items-center justify-center text-2xl shadow-xl shadow-[#c81d25]/20" aria-hidden="true">
        🔒
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-[#c81d25]/20 border border-[#c81d25]/40 text-[#ff4d5a] text-[10px] font-mono tracking-widest uppercase mb-3">
        RESTRICTED VAULT ACCESS
      </div>

      <h1 className="text-2xl font-black tracking-tight text-white uppercase mb-2">
        {isGuest ? 'Administrator Login Required' : 'Access Denied: Admin Rights Required'}
      </h1>
      <p className="text-xs text-neutral-400 mb-8 leading-relaxed">
        {isGuest
          ? 'This console requires Tier-0 Administrator authentication. Please sign in with your administrator account to access drop deployment and stock controls.'
          : `Signed in as ${currentUser.email} with standard member tier. Administrator clearance is required to modify vault releases.`}
      </p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onLogin}
          aria-label={isGuest ? 'Sign in as administrator' : 'Sign in with administrator credentials'}
          className="w-full bg-[#c81d25] hover:bg-[#a5151c] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition text-xs tracking-wider uppercase shadow-lg shadow-[#c81d25]/25 cursor-pointer"
        >
          {isGuest ? 'Sign In as Administrator' : 'Sign In with Admin Account'}
        </button>
        <button
          type="button"
          onClick={onReturnHome}
          aria-label="Return to storefront home page"
          className="w-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold py-3 rounded-xl transition border border-white/10 cursor-pointer"
        >
          Return to Storefront
        </button>
      </div>
    </div>
  )
}
