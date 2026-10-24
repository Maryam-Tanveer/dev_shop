import { TRUST_PERKS } from '../../data/navigation'

export default function TrustSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 w-full">
      <div className="bg-[#f6f4ee] rounded-2xl border border-[#e8e4db] p-6 sm:p-7 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_PERKS.map((perk, index) => {
            const Icon = perk.icon
            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#fde8e8] flex items-center justify-center text-[#c81d25] flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-tight">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {perk.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
