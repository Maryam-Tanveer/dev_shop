import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import CartDrawer from '../../Components/CartDrawer'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { api } from '../../services/api'
import { FALLBACK_BLOGS } from '../../data/blog'

function AuthorAvatar({ src, name, size = 'w-10 h-10' }) {
  const [imageError, setImageError] = useState(false)
  const initials = (name || 'Dev Vault')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name || 'Author'}
        onError={() => setImageError(true)}
        className={`${size} rounded-full object-cover border border-neutral-200 shadow-2xs`}
      />
    )
  }

  return (
    <div
      className={`${size} rounded-full bg-neutral-900 text-white font-black text-xs flex items-center justify-center border border-neutral-300 shadow-2xs flex-shrink-0`}
      title={name}
    >
      {initials}
    </div>
  )
}

export default function BlogDetailPage({ blogId: propBlogId, onNavigate, onSelectProduct }) {
  const { id: paramBlogId } = useParams()
  const articleId = propBlogId || paramBlogId
  const navigate = useNavigate()

  const { wishlistCount } = useWishlist()
  const {
    items: cartItems,
    cartCount,
    removeFromCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCart()

  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    let isMounted = true
    setLoading(true)

    const fallbackArticle = FALLBACK_BLOGS.find(
      (b) => b.id === articleId || b.id === `blog-${articleId}`
    ) || FALLBACK_BLOGS[0]

    api
      .getBlogById(articleId)
      .then((data) => {
        if (!isMounted) return
        if (data && data.title) {
          setArticle(data)
        } else {
          setArticle(fallbackArticle)
        }
      })
      .catch((err) => {
        console.warn('Failed to load blog from API, using fallback:', err.message)
        if (isMounted) setArticle(fallbackArticle)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    // Load related articles
    api
      .getBlogs()
      .then((data) => {
        if (!isMounted) return
        const list = Array.isArray(data) && data.length > 0 ? data : FALLBACK_BLOGS
        setRelatedArticles(list.filter((b) => b.id !== articleId).slice(0, 3))
      })
      .catch(() => {
        if (isMounted) {
          setRelatedArticles(FALLBACK_BLOGS.filter((b) => b.id !== articleId).slice(0, 3))
        }
      })

    return () => {
      isMounted = false
    }
  }, [articleId])

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      showToast('Article link copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const renderContent = (content) => {
    if (!content) return null

    const lines = content.split('\n')
    const elements = []
    let pBuffer = []

    const flushParagraph = () => {
      if (pBuffer.length > 0) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-neutral-700 leading-relaxed text-sm sm:text-base mb-6 font-normal">
            {pBuffer.join(' ')}
          </p>
        )
        pBuffer = []
      }
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      if (!trimmed) {
        flushParagraph()
        return
      }

      if (trimmed.startsWith('### ')) {
        flushParagraph()
        elements.push(
          <h3 key={`h3-${idx}`} className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-8 mb-4">
            {trimmed.replace('### ', '')}
          </h3>
        )
      } else if (trimmed.startsWith('#### ')) {
        flushParagraph()
        elements.push(
          <h4 key={`h4-${idx}`} className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight mt-6 mb-2">
            {trimmed.replace('#### ', '')}
          </h4>
        )
      } else if (trimmed.startsWith('> ')) {
        flushParagraph()
        elements.push(
          <blockquote key={`quote-${idx}`} className="my-8 pl-5 border-l-4 border-[#c81d25] bg-rose-50/50 py-3.5 pr-4 rounded-r-2xl italic text-neutral-800 font-medium text-sm sm:text-base">
            {trimmed.replace(/^>\s*"?/, '').replace(/"?$/, '')}
          </blockquote>
        )
      } else if (/^\d+\.\s+/.test(trimmed) || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph()
        const text = trimmed.replace(/^(\d+\.\s+|\-\s+|\*\s+)/, '')
        elements.push(
          <div key={`li-${idx}`} className="flex items-start gap-2.5 my-2.5 text-sm sm:text-base text-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25] mt-2 flex-shrink-0" />
            <span>{text}</span>
          </div>
        )
      } else {
        pBuffer.push(trimmed)
      }
    })

    flushParagraph()
    return elements
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1a1a1a] flex flex-col font-sans relative selection:bg-[#c81d25] selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 text-xs font-semibold animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#c81d25] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          closeDrawer()
          navigate('/checkout')
        }}
      />

      {/* Navbar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={openDrawer}
        wishlistCount={wishlistCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav="BLOG"
        onNavClick={(item) => {
          if (item === 'HOME') navigate('/')
          else if (item === 'PRODUCTS') navigate('/products')
          else if (item === 'BLOG') navigate('/blog')
          else if (item === 'COLLECTIONS') navigate('/collections')
          else if (item === 'FAQ') navigate('/faq')
          else navigate(`/${item.toLowerCase()}`)
        }}
        onSelectProduct={onSelectProduct}
      />

      <main className="flex-1 pb-16">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-[#c81d25] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Retrieving editorial dispatch...
            </p>
          </div>
        ) : !article ? (
          <div className="max-w-2xl mx-auto py-24 px-4 text-center">
            <h2 className="text-2xl font-black text-neutral-900 mb-3">Dispatch Not Found</h2>
            <p className="text-xs text-neutral-500 mb-6">
              The article you are searching for is unavailable or has been archived.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c81d25] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition hover:bg-[#a6171e]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Editorial Journal</span>
            </Link>
          </div>
        ) : (
          <article className="max-w-[1000px] mx-auto px-4 sm:px-8 pt-6 w-full">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium mb-6 flex-wrap">
              <Link to="/" className="hover:text-neutral-700 transition">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-neutral-300" />
              <Link to="/blog" className="hover:text-neutral-700 transition">
                Blog
              </Link>
              <ChevronRight className="w-3 h-3 text-neutral-300" />
              <span className="text-neutral-700 font-semibold truncate max-w-xs sm:max-w-md">
                {article.title}
              </span>
            </div>

            {/* Back Button */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-neutral-600 hover:text-[#c81d25] transition mb-6 group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition" />
              <span>Back to all dispatches</span>
            </Link>

            {/* Article Meta Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="bg-[#c81d25] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs tracking-wider">
                {article.tag || article.badge || (article.category ? article.category.toUpperCase() : 'EDITORIAL')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-semibold bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>{article.readTime || '5 min read'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>{article.date}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight sm:leading-tight mb-6">
              {article.title}
            </h1>

            {/* Author Card & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-neutral-200/90 mb-8">
              <div className="flex items-center gap-3">
                <AuthorAvatar
                  src={article.authorImage}
                  name={article.author}
                  size="w-11 h-11"
                />
                <div>
                  <h4 className="text-sm font-black text-neutral-900 leading-snug">
                    {article.author}
                  </h4>
                  <p className="text-xs text-neutral-400 font-medium">
                    {article.authorRole || 'Editorial Tastemaker & Contributor'}
                  </p>
                </div>
              </div>

              {/* Share Button */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold px-4 py-2 rounded-xl border border-neutral-200 shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share dispatch</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Featured Hero Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-md mb-10 border border-neutral-200">
              <img
                src={article.image}
                alt={article.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>

            {/* Excerpt Lead */}
            {article.excerpt && (
              <p className="text-base sm:text-lg font-semibold text-neutral-900 leading-relaxed mb-8 border-l-2 border-[#c81d25] pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Formatted Article Body */}
            <div className="prose prose-neutral max-w-none">
              {renderContent(article.content || article.excerpt)}
            </div>

            {/* Bottom Author Bio Card */}
            <div className="mt-14 bg-neutral-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 border border-neutral-200">
              <AuthorAvatar
                src={article.authorImage}
                name={article.author}
                size="w-16 h-16"
              />
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#c81d25]">
                    CURATED BY
                  </span>
                  <Sparkles className="w-3 h-3 text-[#c81d25]" />
                </div>
                <h3 className="text-lg font-black text-neutral-900 mb-1">
                  {article.author}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  {article.authorRole || 'Dev Vault Contributor'} specializing in authentic archival sneaker forensics, street culture narratives, and limited release trend analysis.
                </p>
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-16 pt-10 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#c81d25] block mb-1">
                      KEEP READING
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                      Related Dispatches
                    </h3>
                  </div>
                  <Link
                    to="/blog"
                    className="text-xs font-bold text-[#c81d25] hover:underline"
                  >
                    View all dispatches &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => navigate(`/blog/${rel.id}`)}
                      className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-36 overflow-hidden bg-neutral-100 relative">
                          <img
                            src={rel.image}
                            alt={rel.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                          />
                          <span className="absolute top-2 left-2 bg-[#c81d25] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            {rel.category || 'Article'}
                          </span>
                        </div>
                        <div className="p-4">
                          <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 group-hover:text-[#c81d25] transition line-clamp-2 mb-1.5 leading-snug">
                            {rel.title}
                          </h4>
                          <p className="text-[11px] text-neutral-500 line-clamp-2">
                            {rel.excerpt}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 pt-0 text-[10px] text-neutral-400 font-semibold flex items-center justify-between">
                        <span>{rel.author}</span>
                        <span>{rel.readTime || '5 min read'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </main>

      {/* Footer */}
      <Footer onSubscribe={(email) => showToast(`Subscribed ${email} to Dev Shop Dispatches!`)} />
    </div>
  )
}
