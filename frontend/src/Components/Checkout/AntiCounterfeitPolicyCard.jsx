import { ShieldAlert, Fingerprint } from 'lucide-react'

export default function AntiCounterfeitPolicyCard() {
  return (
    <div className="bg-[#f5f3ee] rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs mt-4">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-2xl bg-white shadow-2xs border border-neutral-200 flex items-center justify-center flex-shrink-0 text-[#c81d25]">
          <Fingerprint className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-neutral-900 mb-0.5">
            Dev Shop Anti-Counterfeit Policy
          </h5>
          <p className="text-[11px] text-neutral-600 leading-relaxed font-normal">
            Dual-stage QR verification tag installed on outsole. 200% refund pledge if our physical authentication fails.
          </p>
        </div>
      </div>
    </div>
  )
}
