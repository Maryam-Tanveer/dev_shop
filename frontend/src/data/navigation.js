import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'

export const NAV_LINKS = [
  'HOME',
  'PRODUCTS',
  'BLOG',
  'COLLECTIONS',
  'FAQ',
  'CHECKOUT',
  'CART',
]

export const FOOTER_COLLECTIONS_LINKS = [
  {
    label: 'Shoes & Sneakers',
    path: '/collections?category=shoes',
  },
  {
    label: 'Bags & Backpacks',
    path: '/collections?category=bags',
  },
  {
    label: 'Dress & Clothing',
    path: '/collections?category=clothing',
  },
  {
    label: 'Technical Outerwear',
    path: '/collections?category=outerwear',
  },
  {
    label: 'Exclusive Collabs',
    path: '/collections?category=collabs',
  },
]

export const FOOTER_SUPPORT_LINKS = [
  {
    label: 'Authenticity Guarantee',
    path: '/faq?category=authentication&item=authentication-process',
  },
  {
    label: 'Order Tracking',
    path: '/faq?category=shipping&item=track-order',
  },
  {
    label: 'Shipping & Delivery',
    path: '/faq?category=shipping&item=delivery-time',
  },
  {
    label: 'Returns & Exchanges',
    path: '/faq?category=returns&item=return-policy',
  },
  {
    label: 'FAQ & Help Desk',
    path: '/faq',
  },
]

export const TRUST_PERKS = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all drop orders over $150',
  },
  {
    icon: RotateCcw,
    title: '30-Day Easy Returns',
    description: 'Hassle-free return policy',
  },
  {
    icon: ShieldCheck,
    title: '100% Secure Payment',
    description: 'Encrypted checkout channels',
  },
  {
    icon: Headphones,
    title: '24/7 Dedicated Support',
    description: 'Live concierge & sizing rep',
  },
]
