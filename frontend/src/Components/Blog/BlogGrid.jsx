import { useEffect, useState } from 'react'
import { Clock, ArrowRight, RotateCw, FileText } from 'lucide-react'
import { api } from '../../services/api'
import { FALLBACK_BLOGS } from '../../data/blog'

function AuthorAvatar({ src, name }) {
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
        className="w-8 h-8 rounded-full object-cover border border-neutral-200 shadow-2xs"
      />
    )
  }

  return (
    <div
      className="w-8 h-8 rounded-full bg-neutral-900 text-white font-black text-[10px] flex items-center justify-center border border-neutral-300 shadow-2xs flex-shrink-0"
      title={name}
    >
      {initials}
    </div>
  )
}

export default function BlogGrid({
  activeFilter = 'all',
  onReadPost,
}) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Fetch blogs dynamically based on category
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    api
      .getBlogs({ category: activeFilter })
      .then((data) => {
        if (!isMounted) return
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data)
        } else {
          // Dynamic in-memory fallback
          const filtered =
            activeFilter === 'all'
              ? FALLBACK_BLOGS
              : FALLBACK_BLOGS.filter(
                  (p) => (p.category || '').toLowerCase() === activeFilter.toLowerCase()
                )
          setPosts(filtered)
        }
      })
      .catch((err) => {
        console.warn('Failed to load blogs from API, using fallback:', err.message)
        if (!isMounted) return
        const filtered =
          activeFilter === 'all'
            ? FALLBACK_BLOGS
            : FALLBACK_BLOGS.filter(
                (p) => (p.category || '').toLowerCase() === activeFilter.toLowerCase()
              )
        setPosts(filtered)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [activeFilter])

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => prev + 3)
      setIsLoadingMore(false)
    }, 400)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 w-full">
      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-4 border-[#c81d25] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Loading editorial dispatches...
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 px-6 bg-white rounded-3xl border border-neutral-200 text-center flex flex-col items-center justify-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#c81d25] mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-neutral-900 mb-1">
            No articles found for &ldquo;{activeFilter}&rdquo;
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mb-4">
            Try switching to another category or select &ldquo;All&rdquo; to browse all editorial stories.
          </p>
        </div>
      ) : (
        /* 3-Column Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, visibleCount).map((post) => {
            const badgeText = post.tag || post.badge || (post.category ? post.category.toUpperCase() : 'EDITORIAL')

            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Frame with Badge (Save button removed as requested) */}
                  <div
                    onClick={() => onReadPost && onReadPost(post)}
                    className="relative h-56 sm:h-60 overflow-hidden bg-neutral-100 cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                    />

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 bg-[#c81d25] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs tracking-wider z-10">
                      {badgeText}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 sm:p-6">
                    {/* Meta Time & Topic */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2.5 font-medium">
                      <span className="flex items-center gap-1 text-[#ea580c] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime || '5 min read'}</span>
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="capitalize">{post.category || 'Culture'}</span>
                    </div>

                    {/* Post Title */}
                    <h3
                      onClick={() => onReadPost && onReadPost(post)}
                      className="text-base sm:text-lg font-extrabold text-neutral-900 group-hover:text-[#c81d25] transition cursor-pointer leading-snug line-clamp-2 mb-2"
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Author & Read More Footer */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <AuthorAvatar
                      src={post.authorImage}
                      name={post.author}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-neutral-900 leading-none">
                        {post.author}
                      </h5>
                      <span className="text-[10px] text-neutral-400">
                        {post.date}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onReadPost && onReadPost(post)}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#c81d25] hover:text-[#991b1b] group/btn transition cursor-pointer"
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Load More Dispatches Row */}
      {!loading && posts.length > visibleCount && (
        <div className="text-center pt-10 pb-4">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold px-6 py-3 rounded-full border border-neutral-300 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#c81d25] ${isLoadingMore ? 'animate-spin' : ''}`} />
            <span>{isLoadingMore ? 'Loading dispatches...' : 'Load more posts'}</span>
          </button>
          <p className="text-[11px] text-neutral-400 mt-2 font-medium">
            Displaying {Math.min(visibleCount, posts.length)} of {posts.length} editorial dispatches
          </p>
        </div>
      )}
    </div>
  )
}
