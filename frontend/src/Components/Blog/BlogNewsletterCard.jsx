import { useState } from 'react'

export default function BlogNewsletterCard({ onSubscribe }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    if (onSubscribe) onSubscribe(email.trim())
    setEmail('')
  }

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

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collector@domain.com"
            required
            className="w-full sm:w-72 bg-[#e5e5e5] text-neutral-900 placeholder-neutral-500 text-xs font-semibold px-4 py-3 rounded-xl border border-transparent focus:border-[#c81d25] outline-none transition"
          />

          <button
            type="submit"
            className="w-full sm:w-auto bg-[#c81d25] hover:bg-[#a8161d] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-md active:scale-95 whitespace-nowrap"
          >
            Join Dispatch
          </button>
        </form>
      </div>
    </div>
  )
}
