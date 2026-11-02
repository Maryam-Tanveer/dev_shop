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
  // ==================== 1. RETRO BASKETBALL ====================
  {
    id: 'col-retro-1',
    series: 'SERIES 01 // HARDWOOD LEGACY',
    title: 'Air Jordan 1 High OG Chicago Lost & Found',
    description:
      'The definitive holy grail of 1985 court culture with cracked vintage leather collars and aged muslin midsoles.',
    badge: '👟 GRAIL RETRO',
    price: 180.0,
    ctaText: 'Explore Chicago',
    subTag: 'VAULT CERTIFIED',
    productId: 'deal-1',
    category: 'retro-basketball',
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-retro-2',
    series: 'SERIES 01 // 1989 OG SPEC',
    title: 'Air Jordan 4 Retro Military Blue 2024',
    description:
      'Archival Tinker Hatfield architecture returning in true 1989 specification with original embossed Nike Air heel branding.',
    badge: '🔥 HOT RELEASE',
    price: 215.0,
    ctaText: 'Shop Military Blue',
    subTag: 'OG NIKE AIR HEEL',
    productId: 'deal-5',
    category: 'retro-basketball',
    image:
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-retro-3',
    series: 'SERIES 01 // HARDWOOD VAULT',
    title: 'Air Jordan 6 Retro GX Eastside',
    description:
      'Premium midnight navy suede overlays and icy translucent pods built for court champions and streetwear rotations.',
    badge: '⚡ 1,200 PAIRS',
    price: 210.0,
    ctaText: 'View Eastside 6',
    subTag: 'NAVY SUEDE GRAIL',
    productId: 'jordan-6-eastside',
    category: 'retro-basketball',
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-retro-4',
    series: 'SERIES 01 // FLIGHT CHASSIS',
    title: 'Jordan 4 Retro Flight Core Nubuck',
    description:
      'High-impact charcoal nubuck chassis engineered with red flight crest detailing and dual-chamber Air dampening.',
    badge: '🎯 TIER 1 DROP',
    price: 420.0,
    ctaText: 'Enter Vault',
    subTag: 'FLIGHT CHASSIS',
    productId: 'rel-1',
    category: 'retro-basketball',
    image:
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-retro-5',
    series: 'SERIES 01 // ARCHIVE COURT',
    title: 'Air Jordan 4 Retro Military Black',
    description:
      'Crisp monochrome contrast blocking on premium white leather with neutral grey suede mudguards and visible heel air.',
    badge: '🖤 MONOCHROME OG',
    price: 210.0,
    ctaText: 'Shop Military Black',
    subTag: 'IN VAULT TODAY',
    productId: 'rec-4',
    category: 'retro-basketball',
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
  },

  // ==================== 2. Y2K RUNNERS ====================
  {
    id: 'col-runner-1',
    series: 'SERIES 02 // VELOCITY & TRAIL',
    title: 'New Balance 990v6 Made in USA Grey',
    description:
      'Handcrafted domestic Boston legacy silhouette upgraded with explosive high-rebound FuelCell foam propulsion.',
    badge: '⚡ MADE IN USA',
    price: 199.0,
    ctaText: 'Shop 990v6',
    subTag: 'FUELCELL PROPULSION',
    productId: 'deal-3',
    category: 'y2k-runners',
    image:
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-runner-2',
    series: 'SERIES 02 // METALLIC Y2K',
    title: 'ASICS GEL-Kayano 14 Pure Silver',
    description:
      'Late-2000s technical runner aesthetic with open mesh layering, gleaming metallic silver accents, and dual GEL pods.',
    badge: '✨ TRENDING RUNNER',
    price: 160.0,
    ctaText: 'Explore Kayano',
    subTag: 'GEL CUSHIONING',
    productId: 'rec-2',
    category: 'y2k-runners',
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-runner-3',
    series: 'SERIES 02 // SCULPTED CHUNKY',
    title: 'New Balance 9060 Sea Salt Rain Cloud',
    description:
      'Warped Y2K futuristic sensibility with exaggerated sway bars, sculpted pod geometry, and ABZORB dampening.',
    badge: '🌊 VIRAL SILHOUETTE',
    price: 210.0,
    ctaText: 'Shop 9060',
    subTag: 'DUAL-DENSITY ABZORB',
    productId: 'rel-4',
    category: 'y2k-runners',
    image:
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-runner-4',
    series: 'SERIES 02 // TERRACE CLASSIC',
    title: 'Adidas Samba OG Core Cloud White',
    description:
      'Timeless 1950s terrace icon featuring full-grain soft leather, authentic suede T-toe, and low-profile gum cupsole.',
    badge: '🏆 COURT ICON',
    price: 100.0,
    ctaText: 'Shop Samba',
    subTag: 'GUM SOLE TRACTION',
    productId: 'rec-3',
    category: 'y2k-runners',
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
  },

  // ==================== 3. STREETWEAR ESSENTIALS ====================
  {
    id: 'col-street-1',
    series: 'SERIES 03 // CUT & SEW HEAVYWEIGHT',
    title: 'Carbon Boxy Fit Drop Hoodie (480GSM)',
    description:
      'Heavyweight 480GSM French terry fleece with pre-shrunk vintage wash, dropped shoulders, and seamless kangaroo pocket.',
    badge: '🔥 480 GSM FLEECE',
    price: 120.0,
    ctaText: 'Shop Hoodie',
    subTag: 'BOXY OVERSIZED FIT',
    productId: 'cross-hoodie',
    category: 'streetwear-essentials',
    image:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-street-2',
    series: 'SERIES 03 // PRIMEKNIT ESSENTIAL',
    title: 'Adidas Yeezy Boost 350 V2 Onyx',
    description:
      'Monochrome black re-engineered Primeknit upper wrapped around a full-length Boost core encased in a ribbed TPU cage.',
    badge: '🖤 ALL-BLACK ESSENTIAL',
    price: 230.0,
    ctaText: 'Explore Onyx',
    subTag: 'FULL BOOST MIDSOLE',
    productId: 'deal-2',
    category: 'streetwear-essentials',
    image:
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-street-3',
    series: 'SERIES 03 // MODULAR UTILITY',
    title: 'Modular Tactical Ripstop Cargo Pant',
    description:
      'Crosshatch tear-resistant ripstop trousers with 8 utility pockets, German fidlock magnetic straps, and cinched cuffs.',
    badge: '👖 RIPSTOP NYLON',
    price: 145.0,
    ctaText: 'Shop Cargo',
    subTag: 'DWR WATER REPELLENT',
    productId: 'street-cargo',
    category: 'streetwear-essentials',
    image:
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-street-4',
    series: 'SERIES 03 // VINTAGE WASH 280GSM',
    title: 'Dev Shop Heavyweight Oversized Tee',
    description:
      'Substantial 280GSM organic combed cotton with thick twin-needle anti-sag collar and boxy street silhouette.',
    badge: '✨ 100% ORGANIC COTTON',
    price: 55.0,
    ctaText: 'Shop Tee',
    subTag: 'DOUBLE-NEEDLE STITCH',
    productId: 'street-tee',
    category: 'streetwear-essentials',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },

  // ==================== 4. VAULT COLLABS ====================
  {
    id: 'col-vault-1',
    series: 'SERIES 04 // TIER-0 GRAILS',
    title: 'Air Jordan 1 Low Cactus Jack Reverse Mocha',
    description:
      'Travis Scott legendary inverted oversized Swoosh crafted from buttery earth-toned nubuck and tumbled sail leather.',
    badge: '🔒 REVERSE MOCHA',
    price: 1250.0,
    ctaText: 'Enter Vault',
    subTag: 'VERIFIED RARE GRAIL',
    productId: 'rel-3',
    category: 'vault-collabs',
    image:
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-vault-2',
    series: 'SERIES 04 // ARCHIVE PAISLEY',
    title: 'Travis Scott x Nike SB Dunk Low PRM QS',
    description:
      'Tear-away navy paisley canvas revealing elephant print beneath, paired with chunky jute rope laces and plaid panels.',
    badge: '🛹 TEAR-AWAY UPPER',
    price: 1420.0,
    ctaText: 'Explore Dunk Grail',
    subTag: 'ROPE LACES DEADSTOCK',
    productId: 'collab-sb-dunk',
    category: 'vault-collabs',
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-vault-3',
    series: 'SERIES 04 // "THE TEN" DECONSTRUCTED',
    title: 'Off-White x Air Jordan 1 Retro High Chicago',
    description:
      'Virgil Abloh historic deconstructed masterpiece with exposed foam collar, floating orange-bartack Swoosh, and zip tie.',
    badge: '⚡ VIRGIL ARCHIVE',
    price: 2850.0,
    ctaText: 'View Off-White',
    subTag: 'SIGNATURE ZIP TIE',
    productId: 'collab-offwhite',
    category: 'vault-collabs',
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-vault-4',
    series: 'SERIES 04 // TRIPLE COLLAB',
    title: 'Fragment Design x Travis Scott x Jordan 1',
    description:
      'Hiroshi Fujiwara lightning bolt emboss meets Cactus Jack reverse Swoosh across premium military blue and sail leather.',
    badge: '⚡ FUJIWARA EMBOSS',
    price: 2150.0,
    ctaText: 'Vault Access',
    subTag: 'MILITARY BLUE / SAIL',
    productId: 'collab-fragment',
    category: 'vault-collabs',
    image:
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  },

  // ==================== 5. TECHNICAL OUTERWEAR ====================
  {
    id: 'col-tech-1',
    series: 'SERIES 05 // ALPINE HARDWARE',
    title: 'The Collection Snowboard: Liquid Crimson',
    description:
      'Carbon-infused alpine responsive core with reactive liquid-molded polymer skins built for sub-zero alpine drops.',
    badge: '🏂 350 BOARDS ONLY',
    price: 749.95,
    ctaText: 'Inspect Board',
    subTag: 'CARBON-INFUSED CHASSIS',
    productId: 'snowboard-liquid',
    category: 'technical-outerwear',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-tech-2',
    series: 'SERIES 05 // ALL-WEATHER ACS',
    title: 'Salomon XT-6 Vanilla Ice Trail Tech',
    description:
      'Full-length Agile Chassis System (ACS) stability cradle, quicklace harness, and deep chevron Contagrip lugs.',
    badge: '🌧 ALL-WEATHER',
    price: 200.0,
    ctaText: 'Shop Trail Tech',
    subTag: 'ACS CHASSIS CRADLE',
    productId: 'rec-1',
    category: 'technical-outerwear',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-tech-3',
    series: 'SERIES 05 // WATERPROOF 28,000MM',
    title: 'Dev Tech 3-Layer GORE-TEX Mountain Shell',
    description:
      'Extreme blizzard protection featuring 3-layer GORE-TEX Pro membrane, seam-sealed micro-tape, and YKK AquaGuard zips.',
    badge: '🛡 GORE-TEX PRO 3L',
    price: 420.0,
    ctaText: 'Shop Shell',
    subTag: 'SEAM SEALED STORM GUARD',
    productId: 'tech-shell',
    category: 'technical-outerwear',
    image:
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-tech-4',
    series: 'SERIES 05 // MODULAR PACK GEAR',
    title: 'Salomon Modular Trail Hydration Vest 12L',
    description:
      'Ultralight 3D Airmesh trail running harness with 12L modular cargo capacity and dual 500ml front hydration flasks.',
    badge: '🎒 SENSICLAD COMFORT',
    price: 165.0,
    ctaText: 'Inspect Pack',
    subTag: 'DUAL 500ML FLASKS',
    productId: 'tech-pack',
    category: 'technical-outerwear',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },

  // ==================== 6. LIMITED DROPS & CARE ====================
  {
    id: 'col-care-1',
    series: 'SERIES 06 // VAULT PROTECTION',
    title: 'Deadstock Deep Shield Cleaning Solution & Brush',
    description:
      'Eco-bio 98.3% natural coconut and jojoba foam formulation safe for delicate suede, nubuck, Primeknit, and aged leather.',
    badge: '🛡 ECO-BIO CLEANER',
    price: 35.0,
    ctaText: 'Protect Grails',
    subTag: '98.3% NATURAL FORMULA',
    productId: 'cross-cleaner',
    category: 'limited-drops-care',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-care-2',
    series: 'SERIES 06 // DELICATE MATERIALS',
    title: 'Micro-Bristle Wild Horsehair Suede Brush Kit',
    description:
      'Solid walnut wood handle with natural horsehair bristles designed to gently restore delicate velvet suede nap.',
    badge: '🐎 100% HORSEHAIR',
    price: 28.0,
    ctaText: 'Shop Brush Kit',
    subTag: 'NUBUCK RESTORATION',
    productId: 'care-horsehair',
    category: 'limited-drops-care',
    image:
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-care-3',
    series: 'SERIES 06 // MUSEUM DISPLAY',
    title: 'UV-Blocking Magnetic Acrylic Sneaker Display Vault',
    description:
      'Museum-grade stackable acrylic display box with neodymium magnetic door and 99% UV radiation blocking.',
    badge: '📦 99% UV SHIELD',
    price: 75.0,
    ctaText: 'Shop Vault Box',
    subTag: 'STACKABLE ACRYLIC',
    productId: 'care-vault-box',
    category: 'limited-drops-care',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-care-4',
    series: 'SERIES 06 // HARDWARE REPLACEMENT',
    title: 'Japanese Waxed Cotton Heavy Lace Kit (Crimson)',
    description:
      'Braided 100% Japanese cotton treated with paraffin wax for weatherproof knot retention, capped with copper aglets.',
    badge: '⚡ COPPER AGLETS',
    price: 16.0,
    ctaText: 'Shop Laces',
    subTag: 'WEATHERPROOF WAX',
    productId: 'cross-laces',
    category: 'limited-drops-care',
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
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
    productId: 'deal-2',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-3',
    badge: 'DAILY GEAR',
    badgeClass: 'bg-white/90 text-neutral-900',
    title: 'ACCESSORIES',
    subtitle: 'Crossbody bags, caps, socks & shoe care kits.',
    productId: 'deal-3',
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
