import { Link } from 'react-router-dom'

export default function AccountHeader({ onNavigate }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        {/* Breadcrumb */}
        <div className="text-[11px] text-neutral-400 font-medium">
          <Link
            to="/"
            onClick={() => onNavigate && onNavigate('HOME')}
            className="hover:text-neutral-700 transition"
          >
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            to="/account"
            onClick={() => onNavigate && onNavigate('ACCOUNT')}
            className="hover:text-neutral-700 transition"
          >
            Account
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-800 font-semibold">Dashboard</span>
        </div>

        {/* Live Server Synced Pill */}
        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-neutral-200/90 shadow-2xs self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#c81d25] animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700">
            VAULT LIVE SERVER SYNCHRONIZED
          </span>
        </div>
      </div>
    </div>
  )
}
