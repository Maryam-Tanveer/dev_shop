import { useState } from 'react'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '../../services/api'

export default function BlogNewsletterCard({ onSubscribe }) {
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
      const res = await api.subscribeNewsletter(trimmed, 'blog_insider_dispatch')

      if (res?.alreadySubscribed) {
        setStatus('already_subscribed')
        setMessage(res.message || 'You are already subscribed to our insider dispatches!')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
        return
      }

      setStatus('success')
      setMessage(res.message || 'Thank you for subscribing! Check your email for your welcome discount.')
      if (onSubscribe) onSubscribe(trimmed)
      setEmail('')

      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Could not subscribe right now. Please try again.')
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  const isLoading = status === 'loading'

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
      <div className="bg-[#1f1f23] rounded-3xl p-8 sm:p-12 border border-neutral-800 shadow-xl text-white flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Column */}
        <div className="max-w-xl">
          <span className="text-neutral-400 text-[10px] font-extrabold uppercase tracking-widest block mb-2">
            DEV SHOP INSIDER BRIEFING
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-2">
            Never miss an exclusive release breakdown
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
            Get our Friday dispatch: free verified release timelines, factory flaw guides, and curated high-fashion styling blueprints directly to your inbox.
          </p>
        </div>

        {/* Right Form & Feedback */}
        <div className="flex flex-col gap-2.5 w-full lg:w-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collector@domain.com"
              required
              disabled={isLoading}
              className="w-full sm:w-72 bg-[#e5e5e5] text-neutral-900 placeholder-neutral-500 text-xs font-semibold px-4 py-3 rounded-xl border border-transparent focus:border-[#c81d25] outline-none transition disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#c81d25] hover:bg-[#a8161d] disabled:opacity-60 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-md active:scale-95 whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Join Dispatch</span>
              )}
            </button>
          </form>

          {/* Feedback messages */}
          {status === 'success' && (
            <div className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-[11px] font-bold animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          {status === 'already_subscribed' && (
            <div className="inline-flex items-center gap-1.5 text-amber-300 bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-lg text-[11px] font-bold animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="inline-flex items-center gap-1.5 text-red-300 bg-red-950/60 border border-red-800/80 px-3 py-1.5 rounded-lg text-[11px] font-bold animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
