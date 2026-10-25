import { useState } from 'react'
import { Info, QrCode, FileText, ShoppingBag, Printer, Download, CheckCircle, X } from 'lucide-react'

export default function OrderSummarySidebar({
  order,
  onViewAccount,
  onContinueShopping,
  onPrintInvoice,
  onDownloadPdf
}) {
  const [showToast, setShowToast] = useState(true)

  const items = order?.items || []
  const subtotal = order?.subtotal !== undefined
    ? Number(order.subtotal)
    : (items.length > 0
        ? items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || it.qty || 1)), 0)
        : 959.95)

  const shippingCost = order?.shippingCost !== undefined ? Number(order.shippingCost) : 0
  const tax = order?.tax !== undefined ? Number(order.tax) : Number((subtotal * 0.08).toFixed(2))
  const totalAmount = order?.totalAmount !== undefined ? Number(order.totalAmount) : Number((subtotal + shippingCost + tax).toFixed(2))
  const orderNumber = order?.orderNumber || (order?._id ? `DS-${order._id.slice(-7).toUpperCase()}` : 'DS-8492019')

  return (
    <div className="space-y-6 relative">
      {/* Floating Inspection Toast */}
      {showToast && (
        <div className="bg-[#121212] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-neutral-700 flex items-center justify-between gap-3 animate-fade-in relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#c81d25] flex items-center justify-center flex-shrink-0 text-white shadow-xs">
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h5 className="text-xs font-black text-white leading-tight">
                Vault Inspection Started
              </h5>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Specialist assigned to {orderNumber}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowToast(false)}
            className="text-neutral-400 hover:text-white transition p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Order Summary Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
        <h3 className="text-base font-black text-neutral-900 tracking-tight pb-4 border-b border-neutral-100 mb-4">
          Order Summary
        </h3>

        {/* Pricing Rows */}
        <div className="space-y-3 text-xs pb-4 border-b border-neutral-100">
          <div className="flex justify-between text-neutral-600">
            <span>Items Subtotal</span>
            <span className="font-bold text-neutral-900">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-neutral-600">
            <span className="flex items-center gap-1">
              <span>Express Vault Courier</span>
              <Info className="w-3 h-3 text-neutral-400" />
            </span>
            <span className="font-black text-[#c81d25]">
              {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE'}
            </span>
          </div>

          <div className="flex justify-between text-neutral-600">
            <span>State & Local Tax (8%)</span>
            <span className="font-bold text-neutral-900">${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-neutral-600">
            <span>Authentication Protocol Fee</span>
            <span className="font-black text-[#c81d25]">$0.00 (Waived)</span>
          </div>
        </div>

        {/* Total Paid Row */}
        <div className="py-4 flex items-center justify-between border-b border-neutral-100">
          <div>
            <span className="text-sm font-black text-neutral-900 block">Total Paid</span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase">INCLUDES TAX & DUTIES</span>
          </div>
          <span className="text-2xl font-black text-[#c81d25]">${totalAmount.toFixed(2)}</span>
        </div>

        {/* Digital Vault Pass QR Box */}
        <div className="bg-[#fcfbfa] rounded-2xl border border-neutral-200/80 p-4 my-5 flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-xl p-1.5 border border-neutral-200 shadow-2xs flex items-center justify-center flex-shrink-0">
            <QrCode className="w-full h-full text-neutral-900" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25]" />
              <span className="text-[9px] font-black uppercase tracking-wider text-[#c81d25]">
                DIGITAL VAULT PASS
              </span>
            </div>
            <h5 className="text-xs font-bold text-neutral-900 leading-tight mb-1">
              Scan to Verify Chain of Custody
            </h5>
            <span className="text-[10px] text-neutral-400 font-mono block">
              Token: DS-NFT-8492019-NYC
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mb-5">
          <button
            onClick={onViewAccount}
            className="w-full py-3.5 px-6 rounded-full bg-[#c81d25] hover:bg-[#a8161d] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>View Order in Account</span>
          </button>

          <button
            onClick={onContinueShopping}
            className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200/90 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 active:scale-95 shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-600" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Print & PDF links */}
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-neutral-500 pt-2 border-t border-neutral-100">
          <button
            onClick={onPrintInvoice}
            className="flex items-center gap-1.5 hover:text-neutral-900 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
          <span className="text-neutral-300">|</span>
          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 hover:text-neutral-900 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Receipt</span>
          </button>
        </div>
      </div>
    </div>
  )
}
