import { ShieldCheck, Shield, Bell } from 'lucide-react'

export default function AuthTrustBar() {
  const items = [
    {
      icon: ShieldCheck,
      title: '100% Authentic Products',
      description: 'Every product verified authentic and quality checked.'
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'End-to-end encrypted checkout and secure transactions.'
    },
    {
      icon: Bell,
      title: 'Instant Order Updates',
      description: 'Live notifications and fast tracking for all your orders.'
    }
  ]

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="bg-[#f6f4ee] rounded-2xl border border-[#e8e4db] p-5 sm:p-6 flex items-center gap-4 shadow-2xs"
            >
              <div className="w-12 h-12 rounded-full bg-[#fde8e8] flex items-center justify-center text-[#c81d25] flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-neutral-900 tracking-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
