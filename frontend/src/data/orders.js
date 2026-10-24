import { Package, Heart, MapPin, Shield, Award } from 'lucide-react'

export const ORDER_PURCHASED_ITEMS = [
  {
    id: 'jordan-6-eastside',
    badge: 'AUTHENTICATED',
    badgeColor: 'bg-[#c81d25] text-white',
    skuTag: 'LIMITED DROP',
    sku: 'SKU: AJ6-GX-EST-95',
    title: 'Air Jordan 6 Retro GX Eastside',
    size: 'US 9.5 M',
    condition: 'Deadstock (Brand New)',
    qty: 1,
    price: 210.0,
    subBadge: '🏷 Tag Attached',
    subBadgeColor: 'text-[#c81d25]',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'snowboard-liquid',
    badge: 'COLLECTOR #18',
    badgeColor: 'bg-neutral-900 text-white',
    skuTag: 'WINTER SPEC',
    sku: 'SKU: SNW-LQD-158',
    title: 'The Collection Snowboard: Liquid Edition',
    size: '158 cm',
    condition: 'Camber / Carbon Stiff',
    qty: 1,
    price: 749.95,
    subBadge: '✓ Vault Cleared',
    subBadgeColor: 'text-neutral-500',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=250&q=80',
  },
]

export const DASHBOARD_TABS = [
  { id: 'orders', label: 'Orders', badge: '2 Active', icon: Package },
  { id: 'wishlist', label: 'Wishlist', badge: '4', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Profile & Security', icon: Shield },
  { id: 'rewards', label: 'Tier Rewards', icon: Award },
]

export const RECENT_DROP_ORDERS = [
  {
    id: 'DS-8492019',
    orderNumber: '#DS-8492019',
    status: 'IN VAULT AUTHENTICATION',
    statusType: 'in-vault',
    placedDate: 'Oct 24, 2024',
    carrier: 'Verified Express Drop Carrier',
    totalAmount: 1036.75,
    formattedTotal: '$1,036.75',
    progressPercent: 65,
    stepperSteps: [
      { label: '✓ 1. DROP SECURED', completed: true },
      { label: '✓ 2. DIGITAL NFC VERIFIED', completed: true },
      { label: '3. PHYSICAL VAULT QC', current: true },
      { label: '4. FINAL DISPATCH', pending: true },
    ],
    note: 'Authenticators are inspecting UV threads and midsole density tags at NYC Vault Station 04.',
    items: [
      {
        id: 'item-1',
        category: 'FOOTWEAR • DROP EXCLUSIVE',
        title: 'Air Jordan 6 GX Eastside',
        specs: 'Size: US 10.5 M • Condition: Deadstock Brand New',
        price: 485.00,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'item-2',
        category: 'GEAR • FALL DROP SERIES',
        title: 'Dev Archive Collection Snowboard 158cm',
        specs: 'Edition 42/100 • Hologram Numbered',
        price: 520.00,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
      },
    ],
  },
  {
    id: 'DS-7821034',
    orderNumber: '#DS-7821034',
    status: '✓ DELIVERED',
    statusType: 'delivered',
    placedDate: 'Sep 15, 2024',
    carrier: 'Signed by M. Vance',
    totalAmount: 230.00,
    formattedTotal: '$230.00',
    items: [
      {
        id: 'item-3',
        category: 'FOOTWEAR • AUTHENTICATED',
        title: 'Yeezy Boost 350 V2 Onyx',
        specs: 'Size: US 11.0 M • Black Static Lacing',
        price: 230.00,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=200&q=80',
      },
    ],
  },
]
