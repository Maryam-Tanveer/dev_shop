export const HERO_DROP = {
  id: 'hero-air-jordan-6',
  productId: 'jordan-6-eastside',
  badge: 'NEW ARRIVAL!',
  name: 'AIR JORDAN 6',
  edition: 'GX EASTSIDE',
  description: 'Elevated suede overlays meet championship heritage detailing. Designed for the relentless cultural pulse of street and court.',
  retailPrice: 210,
  series: 'Series 05 • Edition of 1,200 Pairs',
  status: 'IN VAULT TODAY',
  certified: true,
  image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
}

export const FESTIVAL_PASS = {
  id: 'special-pass-2023',
  title: 'DISC UP TO 50% FOR SNEAKERS FEST ID 2023',
  description: 'Exclusive cultural showcase ticket perks, archive deadstock releases, and daily giveaway draws for all registered members.',
  allocationCap: '82%',
  claimedTier: 'Tier-1 Passes Claimed'
}

export const BEST_DEALS = [
  {
    id: 'deal-1',
    badge: '-18% OFF',
    badgeType: 'discount',
    tag: 'Vault Certified',
    brand: 'JORDAN RETRO',
    title: 'Air Jordan 1 High OG...',
    fullTitle: 'Air Jordan 1 High OG Chicago Lost & Found',
    rating: 5,
    reviews: 339,
    price: 180,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    stock: 14,
    category: 'Nike'
  },
  {
    id: 'deal-2',
    badge: 'HOT DROP!',
    badgeType: 'hot',
    tag: 'Deadstock',
    brand: 'YEEZY COLLECTION',
    title: 'Yeezy Boost 350 V2 Onyx',
    fullTitle: 'Adidas Yeezy Boost 350 V2 Onyx',
    rating: 5,
    reviews: 512,
    price: 230,
    priceSub: 'Market Avg',
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    category: 'Adidas'
  },
  {
    id: 'deal-3',
    badge: '-17% OFF',
    badgeType: 'discount',
    tag: 'Made in USA',
    brand: 'NEW BALANCE MADE',
    title: 'New Balance 990v6 Grey',
    fullTitle: 'New Balance 990v6 Made in USA Castlerock Grey',
    rating: 5,
    reviews: 198,
    price: 199,
    originalPrice: 240,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
    stock: 22,
    category: 'New Balance'
  },
  {
    id: 'deal-4',
    badge: 'RESTOCKED',
    badgeType: 'restock',
    tag: 'Everyday Essential',
    brand: 'NIKE SPORTSWEAR',
    title: 'Nike Dunk Low Retro Panda',
    fullTitle: 'Nike Dunk Low Retro White Black Panda',
    rating: 5,
    reviews: 872,
    price: 115,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    stock: 45,
    category: 'Nike'
  }
]

export const ALL_PRODUCTS = [
  ...BEST_DEALS,
  {
    id: 'jordan-6-eastside',
    badge: 'NEW DROP',
    badgeColor: 'bg-[#c81d25] text-white',
    brand: 'JORDAN RETRO',
    title: 'Nike Air Jordan 6 Retro',
    fullTitle: 'Nike Air Jordan 6 Retro GX Eastside',
    price: 210.00,
    stockStatus: 'In Stock',
    category: 'Nike',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    stock: 12
  },
  {
    id: 'snowboard-liquid',
    badge: 'SALE • SAVE $70',
    badgeColor: 'bg-[#881337] text-white',
    brand: 'EXCLUSIVE WINTER',
    title: 'The Collection Snowboard:...',
    fullTitle: 'The Collection Snowboard: Liquid Crimson',
    price: 749.95,
    originalPrice: 820.00,
    category: 'Automated Collection',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    stock: 5
  },
  {
    id: 'forum-84',
    brand: 'ADIDAS ORIGINALS',
    title: 'Adidas Forum Low 84',
    fullTitle: 'Adidas Forum Low 84 Classic Royal White',
    price: 110.00,
    stockStatus: 'Featured',
    category: 'Adidas',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=600&q=80',
    stock: 19
  },
  {
    id: 'nb-550',
    brand: 'NEW BALANCE',
    title: 'New Balance 550 White...',
    fullTitle: 'New Balance 550 White Green Vintage',
    price: 120.00,
    stockStatus: 'Limited',
    category: 'New Balance',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
    stock: 15
  },
  {
    id: 'asics-kayano',
    badge: 'Y2K RUNNER',
    badgeColor: 'bg-neutral-900 text-white',
    brand: 'ASICS PERFORMANCE',
    title: 'Asics Gel-Kayano 14...',
    fullTitle: 'Asics Gel-Kayano 14 Metallic Silver',
    price: 160.00,
    stockStatus: 'Trending',
    category: 'Hydrogen',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    stock: 24
  },
  {
    id: 'yardsale-low',
    badge: 'UPCOMING',
    badgeColor: 'bg-neutral-200 text-neutral-700',
    brand: 'DEV LAB SPECIAL',
    title: 'Yardsale Minimalist Low-...',
    fullTitle: 'Yardsale Minimalist Low Prototype',
    price: 145.00,
    stockStatus: 'TBA',
    category: 'Top Best Deals',
    isUnavailable: true,
    stock: 0
  }
]

export const COLLECTIONS = [
  {
    id: 'col-1',
    badge: '1,600+ MODELS',
    title: 'SNEAKERS',
    subtitle: 'Retro, runners, skate silhouettes & grails.',
    productId: 'deal-1',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'col-2',
    badge: 'NEW SEASON',
    title: 'APPAREL',
    subtitle: 'Heavyweight Premium terry hoodies & track pants.',
    productId: 'deal-2',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'col-3',
    badge: 'DAILY GEAR',
    title: 'ACCESSORIES',
    subtitle: 'Crossbody bags, caps, socks & shoe care kits.',
    productId: 'deal-3',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'col-4',
    badge: 'RAFFLE VAULT',
    title: 'LIMITED DROPS',
    subtitle: 'Verified releases and deadstock archival lots.',
    productId: 'snowboard-liquid',
    image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80'
  }
]

export const BLOGS = [
  {
    id: 'blog-1',
    tag: 'DESIGN ARCHIVE',
    author: 'Marcus Chen',
    date: 'Oct 24, 2024',
    title: 'The Evolution of Basketball Silhouettes in Street Couture',
    excerpt: 'How hardwood innovations from the mid-80s transformed into global luxury catwalk staples...',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'blog-2',
    tag: 'VERIFICATION GUIDE',
    author: 'Dev Vault Lab',
    date: 'Oct 18, 2024',
    title: '10 Forensic Tell-Tales: Spotting Counterfeit Retro Drops',
    excerpt: 'From box font weight variations to UV-reactive thread checks: our master authenticators break...',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'blog-3',
    tag: 'STREET SCENE',
    author: 'Maya Thorne',
    date: 'Oct 12, 2024',
    title: "Inside London's Underground Deadstock Trading Night",
    excerpt: 'A private Soho basement gathering where vintage collector crates exchange hands alongside raw...',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80'
  }
]

export const FAQ_CATEGORIES = [
  { id: 'shipping', label: 'Shipping', iconName: 'Truck' },
  { id: 'payments', label: 'Payments', iconName: 'CreditCard' },
  { id: 'returns', label: 'Returns', iconName: 'RotateCcw' },
  { id: 'authentication', label: 'Authentication', iconName: 'ShieldCheck' }
]

export const FAQ_DATA = [
  {
    id: 'track-order',
    category: 'shipping',
    question: 'How can I track my order?',
    answer: 'Once your sneaker order is confirmed and authenticated by our specialist team, you will receive an automated shipping notification containing a live tracking link via DHL Express or FedEx. You can also view real-time updates directly in your Dev Shop Account dashboard under Order History.',
    badges: [
      { text: 'VERIFIED PACKAGING', color: 'bg-[#fde8e8] text-[#c81d25] border-[#fecaca]' },
      { text: 'FEDEX PRIORITY AIR • 2-4 DAYS', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' }
    ]
  },
  {
    id: 'delivery-time',
    category: 'shipping',
    question: 'What is the estimated delivery time for my order?',
    answer: 'Standard drops ship within 24 to 48 hours following forensic verification. Domestic orders arrive within 2-4 business days via FedEx Priority Air. International vault deliveries typically require 4-7 business days depending on customs clearance.',
    badges: [
      { text: 'EXPRESS DISPATCH', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' }
    ]
  },
  {
    id: 'authentication-process',
    category: 'authentication',
    question: 'How does Dev Shop verify that all sneakers are 100% authentic?',
    answer: 'Every single pair undergoes our rigorous 12-point physical inspection conducted by seasoned sneaker authenticators. We check UV blacklight stitching, box labels, scent, midsole density, packaging accessories, and QR codes before releasing items to buyers.',
    badges: [
      { text: '12-POINT FORENSIC CHECK', color: 'bg-[#fde8e8] text-[#c81d25] border-[#fecaca]' }
    ]
  },
  {
    id: 'return-policy',
    category: 'returns',
    question: 'What is your 30-day return policy for deadstock shoes?',
    answer: 'We accept returns within 30 days of delivery provided the security tamper tags remain intact and the footwear is in its original deadstock, unworn condition with all accompanying accessories and original packaging.',
    badges: [
      { text: 'NO-HASSLE STORE CREDIT', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' }
    ]
  },
  {
    id: 'modify-order',
    category: 'payments',
    question: 'Can I cancel or modify my order after checkout?',
    answer: 'Because drops move into authentication queue immediately after order confirmation, you have a 30-minute grace window to request changes or cancellation directly through your account dashboard or by messaging our 24/7 concierge.',
    badges: [
      { text: '30-MIN GRACE WINDOW', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' }
    ]
  }
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
      { label: '4. FINAL DISPATCH', pending: true }
    ],
    items: [
      {
        id: 'jordan-6-eastside',
        title: 'Air Jordan 6 Retro GX Eastside',
        size: 'US 9.5 M',
        condition: 'Deadstock (Brand New)',
        price: 210.0,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=250&q=80'
      },
      {
        id: 'snowboard-liquid',
        title: 'The Collection Snowboard: Liquid Edition',
        size: '158 cm',
        condition: 'Camber / Carbon Stiff',
        price: 749.95,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=250&q=80'
      }
    ]
  }
]

export const RELATED_PRODUCTS = [
  {
    id: 'rel-1',
    badge: 'DROP 02',
    category: 'RETRO BASKETBALL',
    title: 'Jordan 4 Retro Flight Core',
    rating: 4.9,
    reviews: 88,
    price: 420.0,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rel-2',
    badge: 'RESTOCKED',
    category: 'LIFESTYLE TECH',
    title: 'Yeezy Boost 350 Bone Matrix',
    rating: 4.8,
    reviews: 214,
    price: 380.0,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rel-3',
    badge: 'RARE COLLAB',
    category: 'SPECIAL EDITION',
    title: 'Air Jordan 1 Low Cactus Jack',
    rating: 5.0,
    reviews: 18,
    price: 1250.0,
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rel-4',
    badge: 'RUNNING',
    category: 'CHUNKY RUNNER',
    title: 'New Balance 9060 Sea Salt',
    rating: 4.7,
    reviews: 64,
    price: 210.0,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80'
  }
]

export const WISHLIST_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    badge: 'NEW DROP',
    badgeColor: 'bg-[#c81d25] text-white',
    brand: 'JORDAN RETRO',
    title: 'Air Jordan 4 Retro Military Blue',
    price: 215.0,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rec-2',
    badge: 'GRAIL',
    badgeColor: 'bg-neutral-900 text-white',
    brand: 'NIKE SB',
    title: 'Travis Scott x Nike SB Dunk Low',
    price: 1420.0,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80'
  }
]

export const CROSS_SELL_ITEMS = [
  {
    id: 'cross-socks',
    category: 'ACCESSORIES',
    title: 'Dev Shop Crew Socks (3-Pack)',
    price: 28.0,
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cross-cleaner',
    category: 'CARE ESSENTIALS',
    title: 'Deadstock Deep Shield Cleaning Solution & Brush',
    price: 35.0,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cross-hoodie',
    category: 'STREETWEAR',
    title: 'Carbon Boxy Fit Drop Hoodie',
    price: 120.0,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cross-laces',
    category: 'LACES & HARDWARE',
    title: 'Reflective Wax Lace Kit Crimson',
    price: 16.0,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'
  }
]
