export const FALLBACK_FAQ_CATEGORIES = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payments', label: 'Payments' },
  { id: 'returns', label: 'Returns' },
  { id: 'authentication', label: 'Authentication' },
]

export const FALLBACK_FAQS = [
  {
    id: 'track-order',
    category: 'shipping',
    question: 'How can I track my order?',
    answer: 'Once your order is confirmed and prepared by our team, you will receive an automated shipping notification with a live tracking link. You can also view real-time updates directly in your Dev Shop Account dashboard under Order History.',
    badges: [
      { text: 'VERIFIED PACKAGING', color: 'bg-[#fde8e8] text-[#c81d25] border-[#fecaca]' },
      { text: 'EXPRESS DELIVERY • 2-4 DAYS', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
  {
    id: 'delivery-time',
    category: 'shipping',
    question: 'What is the estimated delivery time for my order?',
    answer: 'Standard orders ship within 24 to 48 hours following quality checks. Domestic deliveries arrive within 2-4 business days. International deliveries typically require 4-7 business days depending on customs.',
    badges: [
      { text: 'EXPRESS DISPATCH', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
  {
    id: 'authentication-process',
    category: 'authentication',
    question: 'How does Dev Shop verify product authenticity?',
    answer: 'Every single item undergoes a rigorous physical inspection conducted by our verification specialists. We inspect materials, labels, stitching, packaging, and accessories before releasing items to buyers.',
    badges: [
      { text: '100% AUTHENTICITY GUARANTEE', color: 'bg-[#fde8e8] text-[#c81d25] border-[#fecaca]' },
    ],
  },
  {
    id: 'return-policy',
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of delivery provided security tags remain intact and products are in their original, unused condition with all accompanying packaging.',
    badges: [
      { text: '30-DAY EASY RETURNS', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
  {
    id: 'modify-order',
    category: 'payments',
    question: 'Can I cancel or modify my order after checkout?',
    answer: 'Because orders move into preparation shortly after confirmation, you have a 30-minute window to request changes or cancellation directly through your account dashboard or by contacting customer support.',
    badges: [
      { text: '30-MIN CANCELLATION WINDOW', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
  {
    id: 'payment-methods',
    category: 'payments',
    question: 'Which payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and encrypted Stripe checkout channels.',
    badges: [
      { text: 'ENCRYPTED CHECKOUT', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
    ],
  },
]
