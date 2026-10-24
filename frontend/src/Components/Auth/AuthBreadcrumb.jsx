import { Link } from 'react-router-dom'

export default function AuthBreadcrumb({ onHomeClick }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full flex flex-col gap-2">
      {/* Top breadcrumb */}
      <div className="text-[11px] text-neutral-400 font-medium">
        <Link to="/" onClick={onHomeClick} className="hover:text-neutral-700 transition">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-neutral-600">Shop Experience</span>
      </div>

      {/* Sub-header navigation row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs pt-1 border-t border-neutral-200/50">
        <div className="font-medium text-neutral-500 flex items-center gap-1.5 text-[11px]">
          <Link to="/" onClick={onHomeClick} className="hover:text-neutral-800 transition">Home</Link>
          <span>/</span>
          <span>Account</span>
          <span>/</span>
          <span className="font-bold text-neutral-900">Login</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#c81d25] tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25] inline-block animate-pulse"></span>
          <span>DROP ACCESS: ACTIVE SESSION READY</span>
        </div>
      </div>
    </div>
  )
}
