import { useState, useEffect } from 'react'
import { Star, CheckCircle, Loader2 } from 'lucide-react'
import { api } from '../../services/api'

export default function ProductSpecsTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description')
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [newRating, setNewRating] = useState(5)
  const [authorName, setAuthorName] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewContent, setReviewContent] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  const [reviewsList, setReviewsList] = useState([])
  const [avgRating, setAvgRating] = useState(product?.rating || 5.0)
  const [percentages, setPercentages] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
  const [totalReviews, setTotalReviews] = useState(0)

  const productId = product?.id || product?._id

  // Fetch real reviews from DB whenever product changes
  useEffect(() => {
    if (!productId) return

    let isMounted = true
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const res = await api.getProductReviews(productId)
        if (isMounted && res?.success) {
          const list = res.data || []
          setReviewsList(list)
          if (res.count > 0) {
            setTotalReviews(res.count)
            setAvgRating(res.averageRating || 5.0)
            if (res.percentages) setPercentages(res.percentages)
          } else {
            setTotalReviews(0)
            setAvgRating(product?.rating || 5.0)
            setPercentages({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
          }
        }
      } catch (err) {
        console.warn('[REVIEWS] Error loading product reviews:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchReviews()
    return () => {
      isMounted = false
    }
  }, [productId, product?.rating])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!authorName.trim() || !reviewContent.trim()) {
      setSubmitError('Please enter your name and review details.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await api.createProductReview(productId, {
        author: authorName.trim(),
        rating: newRating,
        title: reviewTitle.trim() || 'Verified Vault Purchase',
        content: reviewContent.trim(),
        size: selectedSize || (product?.sizes && product.sizes[0] ? `US ${product.sizes[0]}` : ''),
      })

      if (res?.success) {
        // Prepend created review
        if (res.data) {
          setReviewsList((prev) => [res.data, ...prev])
          setTotalReviews((prev) => prev + 1)
        }
        // Refresh full review stats from backend
        try {
          const updated = await api.getProductReviews(productId)
          if (updated?.success) {
            setReviewsList(updated.data || [])
            setTotalReviews(updated.count || 1)
            setAvgRating(updated.averageRating || newRating)
            if (updated.percentages) setPercentages(updated.percentages)
          }
        } catch {
          // Non-critical
        }

        setSubmitSuccess(true)
        setIsWritingReview(false)
        setAuthorName('')
        setReviewTitle('')
        setReviewContent('')
        setSelectedSize('')
        setNewRating(5)

        setTimeout(() => setSubmitSuccess(false), 5000)
      }
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
            {totalReviews}
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
                `The ${product?.title} is engineered at the collision point of performance engineering and global streetwear culture.`}
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
                <span>Weight per Unit</span>
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
          {/* Success Banner */}
          {submitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your review has been submitted to the Dev Shop database and published successfully!</span>
            </div>
          )}

          {/* Rating Summary Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-[#fbf9f6] rounded-2xl border border-neutral-200/80">
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-neutral-200/80 pb-4 md:pb-0 md:pr-6">
              <div className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight font-mono">
                {avgRating}
              </div>
              <div className="flex justify-center md:justify-start text-amber-400 my-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(avgRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Based on {totalReviews} verified drop collectors
              </p>
            </div>

            {/* Rating Bars */}
            <div className="md:col-span-5 space-y-1.5 text-xs text-neutral-600">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-10 font-bold">{star} Star</span>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentages[star] || 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-neutral-400">
                    {percentages[star] || 0}%
                  </span>
                </div>
              ))}
            </div>

            {/* Write a review button */}
            <div className="md:col-span-3 text-center md:text-right">
              <button
                type="button"
                onClick={() => {
                  setIsWritingReview(!isWritingReview)
                  setSubmitError(null)
                }}
                className="bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md active:scale-95 uppercase tracking-wider cursor-pointer"
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

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {submitError}
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">Your Rating *</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition text-amber-400 focus:outline-none cursor-pointer"
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
                  disabled={isSubmitting}
                  className="text-xs font-semibold px-4 py-2 text-neutral-500 hover:text-neutral-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#c81d25] hover:bg-[#a8161d] disabled:opacity-50 text-white text-xs font-bold px-6 py-2 rounded-xl transition shadow active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    <span>Publish Review</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Loading Indicator */}
          {isLoading && reviewsList.length === 0 && (
            <div className="py-8 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#c81d25]" />
              <span>Loading verified reviews from database...</span>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id || rev._id}
                className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-2 hover:bg-neutral-50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(Number(rev.rating || 5))].map((_, i) => (
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
                  {rev.verified !== false && (
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

            {!isLoading && reviewsList.length === 0 && (
              <div className="py-10 text-center bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
                <p className="text-xs font-bold text-neutral-700 mb-2">No reviews yet for this product</p>
                <p className="text-[11px] text-neutral-400 mb-4">Be the first verified collector to share your rating and thoughts.</p>
                <button
                  type="button"
                  onClick={() => setIsWritingReview(true)}
                  className="bg-[#c81d25] text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer hover:bg-[#a8161d] transition"
                >
                  Write First Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
