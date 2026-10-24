export const COLLECTION_FILTERS = [
  { id: 'all', label: 'ALL COLLECTIONS' },
  { id: 'retro-basketball', label: 'RETRO BASKETBALL' },
  { id: 'y2k-runners', label: 'Y2K RUNNERS' },
  { id: 'streetwear-essentials', label: 'STREETWEAR ESSENTIALS' },
  { id: 'vault-collabs', label: 'VAULT COLLABS' },
  { id: 'technical-outerwear', label: 'TECHNICAL OUTERWEAR' },
  { id: 'limited-drops-care', label: 'LIMITED DROPS & CARE' },
]

export const COLLECTIONS_DATA = [
  {
    id: 'col-1',
    series: 'SERIES 01 // HARDWOOD LEGACY',
    title: 'RETRO BASKETBALL VAULT',
    description:
      'Air Jordan, Dunk High, and court icons preserved in mint condition with guaranteed physical authentication.',
    badge: '👟 640+ SILHOUETTES',
    ctaText: 'Explore Retro',
    subTag: 'DROP TIER 1',
    productId: 'deal-1',
    category: 'retro-basketball',
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-2',
    series: 'SERIES 02 // VELOCITY & TRAIL',
    title: 'Y2K & TECHNICAL RUNNERS',
    description:
      'Asics GEL, New Balance 990v6, Salomon XT-6 for trail and street built for high-mileage daily lifestyle.',
    badge: '⚡ NEW SEASON DROPS',
    ctaText: 'Shop Runners',
    subTag: 'IN HIGH DEMAND',
    productId: 'deal-3',
    category: 'y2k-runners',
    image:
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-3',
    series: 'SERIES 03 // CUT & SEW HEAVYWEIGHT',
    title: 'STREETWEAR & HOODIES',
    description:
      'Boxy fit 480GSM fleece, distressed denim, and everyday oversized essentials designed for modern layering.',
    badge: '🔥 TRENDING APPAREL',
    ctaText: 'Browse Apparel',
    subTag: '500+ GSM FLEECE',
    productId: 'cross-hoodie',
    category: 'streetwear-essentials',
    image:
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-4',
    series: 'SERIES 04 // TIER-0 GRAILS',
    title: 'COLLABS & GRAILS',
    description:
      'Travis Scott, Off-White, Fragment, and Tier-0 collector pieces accompanied by full forensic provenance.',
    badge: '🔒 RAFFLE & VAULT',
    ctaText: 'Enter Vault',
    subTag: 'VERIFIED RARE',
    productId: 'rel-3',
    category: 'vault-collabs',
    image:
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-5',
    series: 'SERIES 05 // TECHNICAL PERFORMANCE',
    title: 'OUTDOOR & TRAIL TECH',
    description:
      'GORE-TEX weather-resistant footwear and modular pack systems built to withstand the harshest urban storms.',
    badge: '🌧 ALL-WEATHER',
    ctaText: 'Shop Trail',
    subTag: 'GORE-TEX GUARD',
    productId: 'snowboard-liquid',
    category: 'technical-outerwear',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-6',
    series: 'SERIES 06 // VAULT PROTECTION',
    title: 'CARE & SNEAKER PRESERVATION',
    description:
      'Specialized micro-bristle horsehair brushes, hydro-repellent nano-sprays, and magnetic display cases.',
    badge: '🛡 VAULT ESSENTIALS',
    ctaText: 'Protect Grails',
    subTag: 'ECO-BIO CLEANERS',
    productId: 'cross-cleaner',
    category: 'limited-drops-care',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
]

// Curated catalogues for Landing Page
export const FEATURED_LANDING_COLLECTIONS = [
  {
    id: 'col-1',
    badge: '1,600+ MODELS',
    badgeClass: 'bg-[#c81d25] text-white',
    title: 'SNEAKERS',
    subtitle: 'Retro, runners, skate silhouettes & grails.',
    productId: 'deal-1',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-2',
    badge: 'NEW SEASON',
    badgeClass: 'bg-white/90 text-neutral-900',
    title: 'APPAREL',
    subtitle: 'Heavyweight Premium terry hoodies & track pants.',
    productId: 'cross-hoodie',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-3',
    badge: 'DAILY GEAR',
    badgeClass: 'bg-white/90 text-neutral-900',
    title: 'ACCESSORIES',
    subtitle: 'Crossbody bags, caps, socks & shoe care kits.',
    productId: 'cross-cleaner',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-4',
    badge: 'RAFFLE VAULT',
    badgeClass: 'bg-[#ea580c] text-white',
    title: 'LIMITED DROPS',
    subtitle: 'Verified releases and deadstock archival lots.',
    productId: 'snowboard-liquid',
    image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80',
  },
]

export const getCollectionsByCategory = (category) => {
  if (!category || category === 'all') return COLLECTIONS_DATA
  return COLLECTIONS_DATA.filter((col) => col.category === category)
}
