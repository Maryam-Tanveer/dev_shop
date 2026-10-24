import { Truck, CreditCard, RotateCcw, ShieldCheck, Box } from 'lucide-react'

export const FAQ_CATEGORIES = [
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'returns', label: 'Returns', icon: RotateCcw },
  { id: 'authentication', label: 'Authentication', icon: ShieldCheck },
]

export const FAQ_DATA = [
  {
    id: 'track-order',
    category: 'shipping',
    question: 'How can I track my order?',
    answer:
      'Once your sneaker order is confirmed and authenticated by our specialist team, you will receive an automated shipping notification containing a live tracking link via DHL Express or FedEx. You can also view real-time updates directly in your Dev Shop Account dashboard under Order History.',
    badges: [
      { text: 'VERIFIED PACKAGING', icon: ShieldCheck, color: 'bg-[#fde8e8] text-[#c81d25] border-[#fecaca]' },
      { text: 'FEDEX PRIORITY AIR • 2-4 DAYS', icon: Box, color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
  {
    id: 'delivery-time',
    category: 'shipping',
    question: 'What is the estimated delivery time for my order?',
    answer:
      'Standard drops ship within 24 to 48 hours following forensic verification. Domestic orders arrive within 2-4 business days via FedEx Priority Air. International vault deliveries typically require 4-7 business days depending on customs clearance.',
    badges: [
      { text: 'EXPRESS DISPATCH', icon: Box, color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
  {
    id: 'authentication-process',
    category: 'authentication',
    question: 'How does Dev Shop verify that all sneakers are 100% authentic?',
    answer:
      'Every single pair undergoes our rigorous 12-point physical inspection conducted by seasoned sneaker authenticators. We check UV blacklight stitching, box labels, scent, midsole density, packaging accessories, and QR codes before releasing items to buyers.',
    badges: [
      { text: '12-POINT FORENSIC CHECK', icon: ShieldCheck, color: 'bg-[#fde8e8] text-[#c81d25] border-[#fecaca]' },
    ],
  },
  {
    id: 'return-policy',
    category: 'returns',
    question: 'What is your 30-day return policy for deadstock shoes?',
    answer:
      'We accept returns within 30 days of delivery provided the security tamper tags remain intact and the footwear is in its original deadstock, unworn condition with all accompanying accessories and original packaging.',
    badges: [
      { text: 'NO-HASSLE STORE CREDIT', icon: ShieldCheck, color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
  {
    id: 'modify-order',
    category: 'payments',
    question: 'Can I cancel or modify my order after checkout?',
    answer:
      'Because drops move into authentication queue immediately after order confirmation, you have a 30-minute grace window to request changes or cancellation directly through your account dashboard or by messaging our 24/7 concierge.',
    badges: [
      { text: '30-MIN GRACE WINDOW', icon: Box, color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
  {
    id: 'payment-methods',
    category: 'payments',
    question: 'What payment methods and installment options do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and flexible interest-free installment plans including Klarna 4x and Afterpay.',
    badges: [
      { text: 'BANK-GRADE 256-BIT ENCRYPTION', icon: ShieldCheck, color: 'bg-[#fde8e8] text-[#c81d25] border-[#fecaca]' },
    ],
  },
]

export const getFaqsByCategory = (category) => {
  if (!category || category === 'all') return FAQ_DATA
  return FAQ_DATA.filter((faq) => faq.category === category)
}
