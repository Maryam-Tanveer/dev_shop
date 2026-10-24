import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { api } from '../../services/api'
import { FEATURED_BLOG_POSTS as FALLBACK_POSTS } from '../../data/blog'

export default function BlogSection({ onReadPost }) {
  const [posts, setPosts] = useState(FALLBACK_POSTS)

  useEffect(() => {
    let isMounted = true
    api
      .getFeaturedBlogs()
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
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-[#c81d25] font-extrabold text-[11px] uppercase tracking-wider block mb-1">
            CULTURE & STORIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Latest from the Blog
          </h2>
        </div>

        <p className="text-xs text-neutral-500 max-w-md sm:text-right">
          Deep dives into sneaker design history, resale insights, and underground street culture.
        </p>
      </div>

      {/* 3 Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden flex flex-col justify-between group hover:shadow-lg transition duration-300"
          >
            <div>
              {/* Image Frame */}
              <div className="relative h-48 overflow-hidden bg-neutral-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />
                {/* Category Pill Tag */}
                <span className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-xs text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {post.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="text-[11px] text-neutral-400 font-semibold mb-2">
                  <span>By {post.author}</span> • <span>{post.date}</span>
                </div>

                <h3 className="text-base font-extrabold text-neutral-900 group-hover:text-[#c81d25] transition leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Read More Link */}
            <div className="px-5 pb-5 pt-1">
              <button
                onClick={() => onReadPost && onReadPost(post)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c81d25] hover:text-[#991b1b] transition"
              >
                <span>Read more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
