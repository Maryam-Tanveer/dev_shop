import { Headphones } from 'lucide-react'

export default function FaqContactBanner({ onContactSupport }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-12">
      <div className="bg-[#f4f2ee] rounded-3xl p-6 sm:p-7 border border-neutral-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xs">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center flex-shrink-0 text-[#c81d25]">
            <Headphones className="w-6 h-6 stroke-[2]" />
          </div>

          <div>
            <h4 className="text-base font-extrabold text-neutral-900 leading-snug">
              Still have questions?
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Our concierge team is available 24/7 to assist with sizing, drops, and authentications.
            </p>
          </div>
        </div>

        {/* Right CTA Button */}
        <button
          onClick={onContactSupport}
          className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold px-7 py-3 rounded-full transition shadow-md active:scale-95 whitespace-nowrap self-stretch sm:self-auto text-center"
        >
          Contact Support
        </button>
      </div>
    </div>
  )
}
