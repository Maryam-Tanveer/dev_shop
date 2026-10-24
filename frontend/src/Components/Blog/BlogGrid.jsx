import { useEffect, useState } from 'react'
import { Clock, Bookmark, ArrowRight, RotateCw } from 'lucide-react'
import { api } from '../../services/api'
import { BLOG_POSTS as FALLBACK_POSTS } from '../../data/blog'

export default function BlogGrid({
  activeFilter = 'all',
  onReadPost,
  onBookmarkPost,
  bookmarks = {}
}) {
  const [posts, setPosts] = useState(FALLBACK_POSTS)
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    let isMounted = true
    api
      .getBlogs()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setPosts(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load blogs from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter((p) => p.category === activeFilter)

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 3, 38))
      setIsLoadingMore(false)
    }, 600)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 w-full">
      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.slice(0, visibleCount).map((post) => {
          const isSaved = !!bookmarks[post.id]

          return (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Frame with Badge & Bookmark */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-neutral-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-[#c81d25] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs tracking-wider z-10">
                    {post.badge}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onBookmarkPost && onBookmarkPost(post.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-[#c81d25] transition shadow-xs z-10"
                    title="Bookmark article"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#c81d25] text-[#c81d25]' : ''}`} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-6">
                  {/* Meta Time & Topic */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2.5 font-medium">
                    <span className="flex items-center gap-1 text-[#ea580c] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span>{post.topic}</span>
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
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-7 h-7 rounded-full object-cover border border-neutral-200"
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
                  onClick={() => onReadPost && onReadPost(post)}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#c81d25] hover:text-[#991b1b] group/btn transition"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition" />
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {/* Load More Dispatches Row */}
      <div className="text-center pt-10 pb-4">
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold px-6 py-3 rounded-full border border-neutral-300 shadow-2xs transition active:scale-95"
        >
          <RotateCw className={`w-3.5 h-3.5 text-[#c81d25] ${isLoadingMore ? 'animate-spin' : ''}`} />
          <span>{isLoadingMore ? 'Loading dispatches...' : 'Load more posts'}</span>
        </button>
        <p className="text-[11px] text-neutral-400 mt-2 font-medium">
          Displaying {Math.min(visibleCount, filteredPosts.length)} of 38 editorial dispatches
        </p>
      </div>
    </div>
  )
}
