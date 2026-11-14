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
    label: 'New Arrivals',
    path: '/collections?category=new-arrivals',
  },
  {
    label: 'Retro Basketball',
    path: '/collections?category=retro-basketball',
  },
  {
    label: 'Running & Lifestyle',
    path: '/collections?category=y2k-runners',
  },
  {
    label: 'Exclusive Collabs',
    path: '/collections?category=vault-collabs',
  },
  {
    label: 'Apparel & Hoodies',
    path: '/collections?category=streetwear-essentials',
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
