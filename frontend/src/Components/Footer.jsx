import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Share2 } from 'lucide-react'
import { FOOTER_COLLECTIONS_LINKS, FOOTER_SUPPORT_LINKS } from '../data/navigation'
import { api } from '../services/api'

export default function Footer({ onSubscribe }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    api.subscribeDropAlert(email, 'Weekly Curated Vault Streetwear Drop').catch(() => {})
    if (onSubscribe) onSubscribe(email)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 2500)
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

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2 text-neutral-400">
              <button
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 hover:text-white flex items-center justify-center border border-neutral-800 transition"
                title="Spark Feed"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 hover:text-white flex items-center justify-center border border-neutral-800 transition"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 2: Shop Collections (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
              SHOP COLLECTIONS
            </h4>
            <ul className="space-y-2.5 text-neutral-400 font-medium">
              {FOOTER_COLLECTIONS_LINKS.map((link) => (
                <li key={link}>
                  <Link to="/collections" className="hover:text-white transition block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Support (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
              CUSTOMER SUPPORT
            </h4>
            <ul className="space-y-2.5 text-neutral-400 font-medium">
              {FOOTER_SUPPORT_LINKS.map((link) => (
                <li key={link}>
                  <Link to="/faq" className="hover:text-white transition block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
              NEWSLETTER
            </h4>
            <p className="text-neutral-400 text-xs mb-3 leading-relaxed">
              Get first-access notifications on hyped sneaker drops and editorial stories.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c81d25] transition"
              />
              <button
                type="submit"
                className="bg-[#c81d25] hover:bg-[#a8161d] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg transition active:scale-95"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © 2024 Dev Shop Global Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition">Terms of Service</a>
            <a href="#" className="hover:text-neutral-300 transition">Security</a>
            <Link to="/admin" className="hover:text-neutral-300 transition opacity-60 hover:opacity-100 font-mono text-[10px]">Vault Console 🔒</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
