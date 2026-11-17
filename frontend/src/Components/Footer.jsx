import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { FOOTER_COLLECTIONS_LINKS, FOOTER_SUPPORT_LINKS } from '../data/navigation'
import { api } from '../services/api'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer({ onSubscribe }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'already_subscribed' | 'error'
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await api.subscribeNewsletter(trimmed, 'footer_newsletter')

      if (res?.alreadySubscribed) {
        setStatus('already_subscribed')
        setMessage(res.message || 'You are already subscribed to our newsletter!')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 4000)
        return
      }

      setStatus('success')
      setMessage(res.message || 'Thank you for subscribing! Check your email for your welcome discount.')
      if (onSubscribe) onSubscribe(trimmed)
      setEmail('')

      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 4000)
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Could not subscribe right now. Please try again.')
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 4000)
    }
  }

  return (
    <footer className="bg-[#151515] text-neutral-400 text-xs mt-12 border-t border-neutral-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-neutral-800">
          {/* Col 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 rounded-full bg-[#c81d25]"></span>
                <span className="w-2.5 h-1.5 rounded-full bg-[#c81d25]"></span>
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                DEV SHOP
              </span>
            </Link>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Curating authentic high-energy sneaker drops, premium streetwear silhouettes, and cultural editorial stories.
            </p>
          </div>

          {/* Col 2: Shop Collections (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
              SHOP COLLECTIONS
            </h4>
            <ul className="space-y-2.5 text-neutral-400 font-medium">
              {FOOTER_COLLECTIONS_LINKS.map((link, idx) => {
                const label = typeof link === 'object' ? link.label : link
                const path = typeof link === 'object' ? link.path : '/collections'
                return (
                  <li key={idx}>
                    <Link to={path} className="hover:text-white transition block">
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Col 3: Customer Support (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
              CUSTOMER SUPPORT
            </h4>
            <ul className="space-y-2.5 text-neutral-400 font-medium">
              {FOOTER_SUPPORT_LINKS.map((link, idx) => {
                const label = typeof link === 'object' ? link.label : link
                const path = typeof link === 'object' ? link.path : '/faq'
                return (
                  <li key={idx}>
                    <Link to={path} className="hover:text-white transition block">
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Col 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
              NEWSLETTER
            </h4>
            <p className="text-neutral-400 text-xs mb-3 leading-relaxed">
              Get first-access notifications on new arrivals, exclusive releases, and store updates.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === 'loading'}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c81d25] transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#c81d25] hover:bg-[#a8161d] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg transition active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : status === 'already_subscribed' ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                    <span>Already Subscribed</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>

            {/* Dynamic Status Feedback */}
            {message && (
              <div
                className={`mt-2.5 text-[11px] font-medium flex items-start gap-1.5 ${
                  status === 'error'
                    ? 'text-rose-400'
                    : status === 'already_subscribed'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {status === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-rose-400" />
                ) : status === 'already_subscribed' ? (
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400" />
                )}
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {CURRENT_YEAR} Dev Shop Global Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/faq" className="hover:text-neutral-300 transition">Privacy & Terms</Link>
            <Link to="/faq" className="hover:text-neutral-300 transition">Security Verification</Link>
            <Link to="/admin" className="hover:text-neutral-300 transition opacity-60 hover:opacity-100 font-mono text-[10px]">Vault Console 🔒</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
