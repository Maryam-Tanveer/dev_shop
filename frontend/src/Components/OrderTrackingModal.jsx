import { useState } from 'react'
import { ShieldCheck, Truck, CheckCircle2, Clock, MapPin, Printer, X, ExternalLink } from 'lucide-react'

export default function OrderTrackingModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null

  const orderNum = order.orderNumber || order.id || 'DEV-VAULT-ORDER'
  const carrier = order.carrier || 'DHL Express Priority Air'
  const waybill = `DEV-EXP-${orderNum.replace(/[^0-9]/g, '') || '984210'}`
  const estDelivery = order.estDelivery || '3 Business Days (Oct 28 – Oct 30)'
  const status = order.status || 'In Transit'

  const checkpoints = [
    {
      time: 'Oct 24, 18:45 EST',
      location: 'JFK Air Cargo Hub, NY',
      desc: 'High-value Vault allocation cleared security inspection. Transferred to air transit.',
      done: true,
    },
    {
      time: 'Oct 24, 14:10 EST',
      location: 'Dev Shop Vault Facility #04, Brooklyn NY',
      desc: 'Physical micro-stitch inspection verified. Encrypted NFC authenticity tag attached.',
      done: true,
    },
    {
      time: 'Oct 24, 11:30 EST',
      location: 'Vault Order Processing',
      desc: 'Payment captured and allocation secured in dedicated deadstock locker.',
      done: true,
    },
    {
      time: 'Estimated Oct 28',
      location: 'Local Delivery Facility',
      desc: 'Package dispatched for signature-required courier handoff.',
      done: false,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121217] text-white border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c81d25]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                LIVE TELEMETRY TRACKER
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-1">
              {orderNum}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Carrier: <span className="text-white font-mono">{carrier}</span> • Waybill:{' '}
              <span className="text-white font-mono">{waybill}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Highlight Banner */}
        <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-[#c81d25]/20 via-[#1f1722] to-neutral-900 border border-[#c81d25]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase">Estimated Delivery</div>
            <div className="text-lg font-black text-white">{estDelivery}</div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{status}</span>
          </div>
        </div>

        {/* 4-Step Stepper Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono uppercase tracking-wider mb-2">
            <span className="text-emerald-400 font-bold">1. Confirmed</span>
            <span className="text-emerald-400 font-bold">2. NFC Scanned</span>
            <span className="text-[#ff4d5a] font-black animate-pulse">3. In Transit</span>
            <span className="text-neutral-500">4. Delivered</span>
          </div>

          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-[#c81d25] to-[#c81d25] rounded-full w-[70%]" />
          </div>
        </div>

        {/* Vault Tamper-evident NFC Seal Card */}
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/5 mb-6 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#c81d25] flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-white uppercase tracking-wider">
              Cryptographic Vault NFC Certified
            </div>
            <div className="text-neutral-400 text-[11px] mt-0.5">
              This shipment is sealed in tamper-evident anti-counterfeit packaging. Tap your smartphone to the shoe's inner collar NFC chip upon delivery to claim ownership provenance.
            </div>
          </div>
        </div>

        {/* Live Checkpoints Log */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#c81d25]" />
            <span>Telemetry Checkpoints Log</span>
          </h4>

          <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10 text-xs">
            {checkpoints.map((cp, idx) => (
              <div key={idx} className="relative">
                <span
                  className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 ${
                    cp.done
                      ? 'bg-emerald-500 border-[#121217]'
                      : 'bg-neutral-700 border-[#121217]'
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] mb-0.5">
                  <span className={`font-bold ${cp.done ? 'text-white' : 'text-neutral-400'}`}>
                    {cp.location}
                  </span>
                  <span className="font-mono text-neutral-500 text-[10px]">{cp.time}</span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">{cp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition font-medium"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Waybill</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition uppercase tracking-wider shadow-lg shadow-[#c81d25]/25"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  )
}
