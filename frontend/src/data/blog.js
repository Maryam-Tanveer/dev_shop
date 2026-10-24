export const BLOG_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'style', label: 'Style' },
  { id: 'fitting', label: 'Fitting' },
  { id: 'general', label: 'General' },
]

export const BLOG_POSTS = [
  {
    id: 'post-1',
    category: 'style',
    badge: 'DESIGN ARCHIVE',
    title: 'The Evolution of Basketball Silhouettes in Street Couture',
    readTime: '5 min read',
    topic: 'Culture',
    excerpt:
      'Tracing hardwood heritage into runway collections, exploring how oversized tongue proportions and ankle collars crossed into modern luxury aesthetics.',
    author: 'Marcus Chen',
    date: 'Oct 24, 2024',
    authorImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post-2',
    category: 'general',
    badge: 'VERIFICATION GUIDE',
    title: '10 Forensic Tell-Tales: Spotting Counterfeit Retro Drops',
    readTime: '8 min read',
    topic: 'Auth Tech',
    excerpt:
      'Our authentication lab reveals micro-stitching errors, foam density discrepancies, and box tag UV font spacing that counterfeiters consistently miss.',
    author: 'Dev Vault Lab',
    date: 'Oct 21, 2024',
    authorImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post-3',
    category: 'general',
    badge: 'STREET SCENE',
    title: "Inside London's Underground Deadstock Trading Night",
    readTime: '6 min read',
    topic: 'Events',
    excerpt:
      "An exclusive peek past the velvet ropes of Soho's monthly invite-only cash-and-carry meetups where 80s samples change hands in seconds.",
    author: 'Maya Thorne',
    date: 'Oct 19, 2024',
    authorImage:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    image:
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post-4',
    category: 'style',
    badge: 'RELEASE INSIGHTS',
    title: 'How Japanese Denim Reshaped Modern Sneaker Culture',
    readTime: '4 min read',
    topic: 'Materials',
    excerpt:
      'From Okayama looms to global collaborations, discovering the indigo-dye craft that taught sneaker collectors the sacred beauty of gradual patina.',
    author: 'Kenji Sato',
    date: 'Oct 16, 2024',
    authorImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post-5',
    category: 'fitting',
    badge: "BUYER'S GUIDE",
    title: 'Air Jordan Sizing Masterclass: How Retros Really Fit',
    readTime: '7 min read',
    topic: 'Fit Lab',
    excerpt:
      'Breakdown of toe-box volume across models 1 through 14. Determine when to go half-size up or stay true to size across leather and nubuck iterations.',
    author: 'Elijah Ward',
    date: 'Oct 12, 2024',
    authorImage:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    image:
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post-6',
    category: 'style',
    badge: 'CULTURE',
    title: 'Autumn/Winter Streetwear Essentials: Layering with High-Tops',
    readTime: '5 min read',
    topic: 'Editorial',
    excerpt:
      'Balancing heavy outerwear proportions, wool trousers, and technical down jackets without burying iconic sneaker silhouettes beneath hem breaks.',
    author: 'Sarah Jenkins',
    date: 'Oct 09, 2024',
    authorImage:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    image:
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  },
]

// Featured teaser subset for Landing Page
export const FEATURED_BLOG_POSTS = [
  {
    id: 'blog-1',
    tag: 'DESIGN ARCHIVE',
    author: 'Marcus Chen',
    date: 'Oct 24, 2024',
    title: 'The Evolution of Basketball Silhouettes in Street Couture',
    excerpt: 'How hardwood innovations from the mid-80s transformed into global luxury catwalk staples...',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'blog-2',
    tag: 'VERIFICATION GUIDE',
    author: 'Dev Vault Lab',
    date: 'Oct 18, 2024',
    title: '10 Forensic Tell-Tales: Spotting Counterfeit Retro Drops',
    excerpt: 'From box font weight variations to UV-reactive thread checks: our master authenticators break...',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'blog-3',
    tag: 'STREET SCENE',
    author: 'Maya Thorne',
    date: 'Oct 12, 2024',
    title: "Inside London's Underground Deadstock Trading Night",
    excerpt: 'A private Soho basement gathering where vintage collector crates exchange hands alongside raw...',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80',
  },
]

export const getBlogPostsByCategory = (category) => {
  if (!category || category === 'all') return BLOG_POSTS
  return BLOG_POSTS.filter((post) => post.category === category)
}
