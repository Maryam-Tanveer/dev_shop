import { Link } from 'react-router-dom'

export default function AuthBreadcrumb({ onHomeClick }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
        <Link to="/" onClick={onHomeClick} className="hover:text-neutral-800 transition">
          Home
        </Link>
        <span>/</span>
        <span>Account</span>
        <span>/</span>
        <span className="font-bold text-neutral-900">Login</span>
      </div>
    </div>
  )
}
