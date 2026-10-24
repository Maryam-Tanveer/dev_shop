import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute component:
 * Guarantees routes like /account and /checkout are only accessible to authenticated users.
 * While session/JWT is being verified on mount, shows a premium DevShop loading state.
 * If unauthenticated, seamlessly redirects to /login preserving the requested path in location.state.from.
 */
export default function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#c81d25] animate-spin" />
          <div className="absolute w-8 h-8 rounded-full bg-[#c81d25]/20 animate-pulse" />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-mono">
          Verifying Vault Session...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return children ? children : <Outlet />
}
