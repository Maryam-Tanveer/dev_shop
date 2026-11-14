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


export const BLOGS = [
  {
    id: 'blog-1',
    tag: 'DESIGN ARCHIVE',
    category: 'style',
    readTime: '5 min read',
    author: 'Marcus Chen',
    authorRole: 'Footwear Historian & Stylist',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    date: 'Oct 24, 2024',
    title: 'The Evolution of Basketball Silhouettes in Street Couture',
    excerpt: 'How hardwood innovations from the mid-80s transformed into global luxury catwalk staples and shaped modern streetwear.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
    content: `Basketball silhouettes have long surpassed the confines of sports arenas. What began in 1985 with high-top ankle padding and bold leather panelling has evolved into the definitive cornerstone of contemporary high-fashion streetwear.

### The Hardwood Genesis
In the mid-1980s, athletic performance footwear was purely utilitarian. Pivot points, vulcanized outsoles, and padded leather collars were engineered to protect athletes against intense torque on hardwood floors. However, the cultural osmosis happening in New York, Chicago, and Tokyo quickly pulled these performance shoes onto subway platforms and concrete avenues.

### Luxury Runway Co-optation
Over the past decade, luxury fashion houses took notice. By elevating classic basketball cuts with premium Italian calfskin, exaggerated proportions, and distressed vintage patinas, designers redefined the boundaries between luxury couture and sneakerhead subculture.

> "A great basketball silhouette does not just elevate an outfit—it anchors the entire narrative of movement and street heritage."

### How to Style Basketball High-Tops Today
1. **Relaxed Tailoring:** Pair voluminous high-tops with wide-legged pleated trousers that drape lightly over the collar.
2. **Proportional Balance:** Offset padded midsoles with boxy, heavyweight cropped tees or heavyweight French terry hoodies.
3. **Heritage Color Blocking:** Let vintage colorways like Chicago red or Royal blue serve as the single focal accent against minimalist palettes.`
  },
  {
    id: 'blog-2',
    tag: 'VERIFICATION GUIDE',
    category: 'general',
    readTime: '7 min read',
    author: 'Dev Vault Lab',
    authorRole: 'Chief Authentication Team',
    authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    date: 'Oct 18, 2024',
    title: '10 Forensic Tell-Tales: Spotting Counterfeit Retro Drops',
    excerpt: 'From box font weight variations to UV-reactive thread checks: our master authenticators break down what to examine before buying.',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80',
    content: `In an era where unauthorized replicas are manufactured using near-identical manufacturing techniques, distinguishing an authentic deadstock grail from a sophisticated fake requires forensic-grade diligence.

### 1. UV Blacklight Stitch Inspection
Authentic factory production runs follow precise automated stitching sequences. Under a 365nm UV blacklight, genuine pairs will reveal uniform tension and invisible stitch guide markings, whereas counterfeit variants frequently reveal uneven glue drips, irregular thread luminescence, and factory alignment stamps.

### 2. Box Label Typography & Barcode Density
Counterfeits frequently fail at microscopic typographic execution. Examine:
- **Font Kerning:** Look for inconsistent letter spacing on color codes and sizing matrices.
- **RFID Chip Integration:** Authentic modern boxes embed thin RFID antennas behind the label; fakes either mimic the print or use non-responsive transponders.

### 3. Outsole Density & Rubber Scent
Industrial adhesives used by authorized Nike and Adidas manufacturing facilities produce a very specific mild vulcanized aroma. Counterfeits that rely on toxic petro-chemical adhesives emit a harsh synthetic chemical scent that lingers for weeks.

> "True authenticity isn't just about what you see on the surface; it's about the microscopic structural engineering that counterfeiters can never cost-justify replicating."`
  },
  {
    id: 'blog-3',
    tag: 'STREET SCENE',
    category: 'general',
    readTime: '5 min read',
    author: 'Maya Thorne',
    authorRole: 'Culture Correspondent',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    date: 'Oct 12, 2024',
    title: "Inside London's Underground Deadstock Trading Night",
    excerpt: 'A private Soho basement gathering where vintage collector crates exchange hands alongside raw beats, coffee, and streetwear culture.',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80',
    content: `Tucked behind an unmarked steel door beneath Soho's neon-drenched Berwick Street, fifty of Europe's most dedicated sneaker archivists gathered for a clandestine trading session.

### The Return to Analog Trading
In a world dominated by resale apps and speculative stock-ticker interfaces, tonight is deliberately analog. No digital payment apps, no bot-sniped drops. Just collectors assessing vintage leather grain under bare tungsten bulbs, debating the provenance of 1994 Air Jordan 1s, and trading rare pieces direct from hand to hand.

### What Was on the Tables
- **1985 Jordan 1 High "Chicago"** with pristine factory box and original laces.
- **Nike Dunk Low Pro SB "Paris"** with original hand-cut canvas paneling.
- **Unreleased Sample Yeezy 700s** sourced directly from European sample batches.

The atmosphere was electric: low-tempo UK garage vinyl records spun quietly in the background while collectors discussed sneaker restoration techniques and the preservation of vintage polyurethane midsoles.`
  },
  {
    id: 'blog-4',
    tag: 'FIT MATRIX',
    category: 'fitting',
    readTime: '6 min read',
    author: 'Kofi Mensah',
    authorRole: 'Footwear Ergonomist & Reviewer',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    date: 'Nov 08, 2024',
    title: 'The Definitive Sneaker Sizing & Fit Guide: From Jordan to Yeezy',
    excerpt: 'Never guess your size on an online drop again. A comprehensive breakdown of toe-box volume, instep clearance, and sizing recommendations.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    content: `Buying sneakers online during a high-stakes vault drop leaves zero room for sizing errors. Because returns on limited allocations are often subject to strict stock availability, knowing your exact fit across different brands is essential.

### Sizing Rules by Silhouette

#### 1. Air Jordan 1 High & Low (True to Size)
Air Jordan 1s fit standard True to Size (TTS). The toe box has a moderate taper. If you have wide feet, consider going up half a size (+0.5) to avoid lateral pinky pinch during extended wear.

#### 2. Yeezy Boost 350 V2 (Go Up 0.5 Size)
Due to the reinforced Primeknit upper and internal toe-cage reinforcement, the Yeezy 350 V2 runs snug. Always order a half-size up (+0.5) from your standard sneaker size for the best fit.

#### 3. New Balance 990 Series (True to Size or Half Down)
Made in USA New Balance silhouettes have generous forefoot volume. True-to-size yields a relaxed fit; for a locked-in secure feel, sizing down half a size (-0.5) is common among enthusiasts.

### Key Fitting Tips
- **Measure at Dusk:** Feet naturally expand throughout the day. Always measure foot dimensions in the evening.
- **Account for Sock Thickness:** Heavyweight ribbed streetwear socks add approximately 2-3mm of interior volume.`
  },
  {
    id: 'blog-5',
    tag: 'STYLE ESSENTIALS',
    category: 'style',
    readTime: '4 min read',
    author: 'Elena Rostova',
    authorRole: 'Fashion Editor & Wardrobe Stylist',
    authorImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    date: 'Nov 02, 2024',
    title: 'Monochrome Streetwear: Mastering Texture & Layering',
    excerpt: 'How to assemble an all-black or muted earth-tone fit without looking flat: contrast ripstop, heavyweight fleece, and statement kicks.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    content: `The all-black outfit is an enduring uniform in urban street style. However, wearing single-tone garments often results in a flat, silhouette-erasing aesthetic unless you intentionally contrast fabric textures and material finishes.

### The Rule of Three Textures
To bring depth to a monochrome fit, combine at least three distinct material finishes:
- **Matte Heavyweight Cotton:** 480GSM French terry hoodies or loopback sweatpants.
- **Technical Lustre:** Waterproof GORE-TEX, technical ripstop nylon cargo pants, or bonded taffeta windbreakers.
- **Leather & Rubber:** Polished full-grain sneaker uppers with matte vulcanized midsoles.

### Playing with Volumes
When color is removed as a variable, silhouette structure becomes everything. Contrast a cropped, boxy oversized jacket with structured straight-leg pants, allowing your footwear to anchor the geometry of the entire look.`
  },
  {
    id: 'blog-6',
    tag: 'COMFORT ARCHIVE',
    category: 'fitting',
    readTime: '5 min read',
    author: 'Maya Thorne',
    authorRole: 'Culture Correspondent',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    date: 'Oct 29, 2024',
    title: 'Wide-Foot Silhouette Breakdown: Comfort vs Statement Profiles',
    excerpt: 'Our laboratory rates the roomiest toe-boxes and most forgiving arches among hyped releases for all-day comfort without sacrificing style.',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80',
    content: `For sneaker enthusiasts with wider feet, certain grail releases can feel like torture devices. Fortunately, several hype-worthy silhouettes combine generous forefoot widths with top-tier aesthetic credentials.

### Top Wide-Foot Friendly Picks
1. **New Balance 2002R & 1906R:** Featuring flexible open-mesh uppers that adapt readily to foot contours without painful pressure points.
2. **Nike Air Force 1 '07:** Built on a notoriously wide platform. Most wide-foot wearers can stay comfortably True to Size.
3. **Asics Gel-Kayano 14:** Exceptional lateral support paired with Gel cushioning that dissipates foot fatigue during high-mileage urban walking.

### Silhouettes to Approach With Caution
- **Nike Blazer Mid 77:** Narrow throat and rigid sidewall construction make entry and forefoot comfort challenging for wide feet.
- **Adidas Samba OG:** Low-profile vintage soccer last with significant toe-box taper; size up by at least a half size.`
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

export const COLLECTIONS = [
  {
    id: 'col-shoes',
    series: 'SERIES 01 // FOOTWEAR ARCHIVE',
    title: 'Shoes Collection',
    description: 'Archival Air Jordan retro high-tops, Yeezys, retro court Dunks, and high-performance technical runners.',
    badge: '17 STYLES • FOOTWEAR',
    itemCount: 17,
    ctaText: 'View Shoes',
    subTag: 'ALL SNEAKERS & SHOES',
    category: 'shoes',
    targetCategory: 'Shoes',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-clothing',
    series: 'SERIES 02 // CUT & SEW ESSENTIALS',
    title: 'Dress & Clothing Collection',
    description: 'Heavyweight 480GSM French terry hoodies, oversized dropped-shoulder tees, and modular tactical ripstop pants.',
    badge: '3 STYLES • STREETWEAR',
    itemCount: 3,
    ctaText: 'View Clothing',
    subTag: 'APPAREL & HOODIES',
    category: 'clothing',
    targetCategory: 'Dress & Clothing',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-bags',
    series: 'SERIES 03 // MODULAR BAGS & PACKS',
    title: 'Bags & Packs Collection',
    description: 'Ultralight hydration vests, mil-spec Cordura waterproof sling bags, and ballistic sneaker travel duffle bags.',
    badge: '3 STYLES • BAGS & PACKS',
    itemCount: 3,
    ctaText: 'View Bags',
    subTag: 'BAGS & TRAVEL PACKS',
    category: 'bags',
    targetCategory: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-outerwear',
    series: 'SERIES 04 // ALL-WEATHER SHIELD',
    title: 'Outerwear Collection',
    description: 'Fully seam-taped 28,000mm waterproof alpine membrane shells and technical all-weather mountain jackets.',
    badge: '3-LAYER GORE-TEX',
    itemCount: 2,
    ctaText: 'View Outerwear',
    subTag: 'WEATHERPROOF SHELLS',
    category: 'outerwear',
    targetCategory: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-accessories',
    series: 'SERIES 05 // VAULT HARDWARE & CARE',
    title: 'Accessories & Care Collection',
    description: 'Paraffin waxed cotton laces, wild horsehair suede brushes, natural cleaning solutions, and UV display vaults.',
    badge: '4 STYLES • CARE & DISPLAY',
    itemCount: 4,
    ctaText: 'View Accessories',
    subTag: 'SNEAKER CARE & DISPLAY',
    category: 'accessories',
    targetCategory: 'Accessories',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'col-collabs',
    series: 'SERIES 06 // LIMITED COLLABORATIONS',
    title: 'Exclusive Collabs Collection',
    description: 'Ultra-rare cultural crossovers: Travis Scott Cactus Jack, Off-White Virgil Abloh deconstructions, and Fragment Design grails.',
    badge: '4 STYLES • TIER-1 GRAILS',
    itemCount: 4,
    ctaText: 'View Collabs',
    subTag: 'LIMITED ALLOCATIONS',
    category: 'collabs',
    targetCategory: 'Exclusive Collabs',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
  },
]
