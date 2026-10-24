import { useState } from 'react'
import { Star } from 'lucide-react'

export default function ProductSpecsTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description')
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [authorName, setAuthorName] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewContent, setReviewContent] = useState('')
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'Marcus V.',
      rating: 5,
      date: 'Oct 22, 2026',
      title: 'Flawless execution & premium leather',
      content: 'Insane comfort and the build quality in person exceeds expectations. True to size with plenty of lock-down support. Box arrived with authentic NFC tag fully verified.',
      verified: true,
      size: 'US 10.5',
    },
    {
      id: 2,
      author: 'Kenji T.',
      rating: 5,
      date: 'Oct 19, 2026',
      title: 'Top tier deadstock addition',
      content: 'Was fortunate to secure this on drop day. The silhouette stands out effortlessly with cargo or tapered pants. Fast shipping from the Vault.',
      verified: true,
      size: 'US 9.0',
    },
  ])

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!authorName.trim() || !reviewContent.trim()) return

    const newRev = {
      id: Date.now(),
      author: authorName.trim(),
      rating: newRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Verified Vault Drop Purchase',
      content: reviewContent.trim(),
      verified: true,
      size: 'US 10.0',
    }

    setReviewsList([newRev, ...reviewsList])
    setIsWritingReview(false)
    setAuthorName('')
    setReviewTitle('')
    setReviewContent('')
    setNewRating(5)
  }

  return (
    <section className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-10 shadow-xs">
      {/* Tabs Header */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-neutral-200/80 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('description')}
          className={`text-sm sm:text-base font-extrabold transition relative pb-2 ${
            activeTab === 'description'
              ? 'text-[#c81d25] after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-[#c81d25]'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Description</span>
          <span className="ml-1 text-[#c81d25]">•</span>
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`text-sm sm:text-base font-extrabold transition relative pb-2 ${
            activeTab === 'specs'
              ? 'text-[#c81d25] after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-[#c81d25]'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Details & Specs
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`text-sm sm:text-base font-extrabold transition relative pb-2 flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'text-[#c81d25] after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-[2px] after:bg-[#c81d25]'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Customer Reviews</span>
          <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-bold">
            {product?.reviews || 42}
          </span>
        </button>
      </div>

      {/* Tab 1: Description Content */}
      {activeTab === 'description' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Text & Features (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {product?.description ||
                `The ${product?.title} is engineered at the collision point of performance engineering and global streetwear culture. Featuring an ultra-responsive responsive carbon-infused chassis.`}
            </p>

            {product?.descriptionSecond && (
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                {product.descriptionSecond}
              </p>
            )}

            {/* 2 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-[#fcfbfa] rounded-2xl border border-neutral-200 p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c81d25] block mb-1">
                  {product?.feature1Title || 'THERMAL SHIELD 300'}
                </span>
                <h4 className="text-xs font-bold text-neutral-900 mb-1">
                  {product?.feature1Subtitle || 'Minus 20°C Rated Insulation'}
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {product?.feature1Desc || 'Aero-gel woven interior membrane for non-bulky warmth.'}
                </p>
              </div>

              <div className="bg-[#fcfbfa] rounded-2xl border border-neutral-200 p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c81d25] block mb-1">
                  {product?.feature2Title || 'REACTIVE POLYMER'}
                </span>
                <h4 className="text-xs font-bold text-neutral-900 mb-1">
                  {product?.feature2Subtitle || 'Traction Micro-Grooves'}
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {product?.feature2Desc || 'Laser-carved ice grip lugs with self-cleaning channels.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Release Metadata Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#f6f4ee] rounded-2xl border border-[#e8e4db] p-6 shadow-2xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-[#e2dcd0]">
              RELEASE METADATA
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Release Code</span>
                <span className="font-mono font-bold text-neutral-900">{product?.releaseCode || 'DS-LIQ-2025-09'}</span>
              </div>

              <div className="flex justify-between items-center text-neutral-600">
                <span>Global Allocation</span>
                <span className="font-bold text-neutral-900">{product?.globalAllocation || 'Tier-Zero Retail Only'}</span>
              </div>

              <div className="flex justify-between items-center text-neutral-600">
                <span>Weight per Shoe</span>
                <span className="font-bold text-neutral-900">{product?.weight || '330g (Size 9 US)'}</span>
              </div>

              <div className="flex justify-between items-center text-neutral-600">
                <span>Country of Origin</span>
                <span className="font-bold text-neutral-900">{product?.origin || 'Designed in Beaverton, OR'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Specs */}
      {activeTab === 'specs' && (
        <div className="space-y-3 text-xs text-neutral-600">
          <p>• <strong>Upper Material:</strong> Triple-layered ballistic ripstop nylon with protective film coating.</p>
          <p>• <strong>Midsole:</strong> Dual-density cushioning core enveloped in responsive stability carrier.</p>
          <p>• <strong>Outsole:</strong> High-traction rubber compound engineered for all-day pavement traversal.</p>
          <p>• <strong>Closure:</strong> Precision lacing system with external support reinforcements.</p>
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Rating Summary Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-[#fbf9f6] rounded-2xl border border-neutral-200/80">
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-neutral-200/80 pb-4 md:pb-0 md:pr-6">
              <div className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight font-mono">
                {product?.rating || 4.9}
              </div>
              <div className="flex justify-center md:justify-start text-amber-400 my-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Based on {reviewsList.length + (product?.reviews || 42)} verified drop collectors
              </p>
            </div>

            {/* Rating Bars */}
            <div className="md:col-span-5 space-y-1.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="w-10 font-bold">5 Star</span>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[85%]" />
                </div>
                <span className="w-8 text-right font-mono text-neutral-400">85%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-10 font-bold">4 Star</span>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[12%]" />
                </div>
                <span className="w-8 text-right font-mono text-neutral-400">12%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-10 font-bold">3 Star</span>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[3%]" />
                </div>
                <span className="w-8 text-right font-mono text-neutral-400">3%</span>
              </div>
            </div>

            {/* Write a review button */}
            <div className="md:col-span-3 text-center md:text-right">
              <button
                type="button"
                onClick={() => setIsWritingReview(!isWritingReview)}
                className="bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md active:scale-95 uppercase tracking-wider"
              >
                {isWritingReview ? 'Close Form' : 'Write a Review'}
              </button>
            </div>
          </div>

          {/* Write Review Form */}
          {isWritingReview && (
            <form onSubmit={handleReviewSubmit} className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4 animate-fade-in">
              <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight">
                Submit Verified Collector Review
              </h4>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">Your Rating *</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition text-amber-400 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-neutral-700 font-mono">
                    {newRating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan M."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:border-[#c81d25] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Impeccable leather quality & fit"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:border-[#c81d25] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">Review Details *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Share details regarding craftsmanship, silhouette sizing, comfort, and vault authentication box packaging..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:border-[#c81d25] focus:outline-none transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="text-xs font-semibold px-4 py-2 text-neutral-500 hover:text-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold px-6 py-2 rounded-xl transition shadow active:scale-95"
                >
                  Publish Review (+50 Vault Pts)
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-2 hover:bg-neutral-50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {rev.title && (
                      <span className="text-xs font-black text-neutral-900">{rev.title}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                  "{rev.content}"
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500 font-medium">
                  <span className="font-bold text-neutral-800">{rev.author}</span>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      ✓ Verified Vault Buyer
                    </span>
                  )}
                  {rev.size && (
                    <span className="text-neutral-400">• Size: {rev.size}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
