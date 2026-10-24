import { useEffect, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { api } from '../../services/api'
import { FAQ_DATA as FALLBACK_FAQS } from '../../data/faq'

export default function FaqAccordion({ activeCategory }) {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS)
  const [openId, setOpenId] = useState('track-order')

  useEffect(() => {
    let isMounted = true
    api
      .getFaqs(activeCategory)
      .then((res) => {
        if (isMounted && res && Array.isArray(res.items) && res.items.length > 0) {
          setFaqs(res.items)
        }
      })
      .catch((err) => {
        console.error('Failed to load FAQs from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [activeCategory])

  const displayedFaqs = activeCategory
    ? faqs.filter((faq) => faq.category === activeCategory).length > 0
      ? faqs.filter((faq) => faq.category === activeCategory)
      : faqs
    : faqs

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-3.5 mb-10">
      {displayedFaqs.map((faq) => {
        const isOpen = openId === faq.id

        return (
          <div
            key={faq.id}
            className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xs ${
              isOpen
                ? 'border-neutral-300 ring-1 ring-neutral-200'
                : 'border-neutral-200/90 hover:border-neutral-300'
            }`}
          >
            {/* Question Header */}
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer"
            >
              <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 leading-snug">
                {faq.question}
              </h3>

              {/* Toggle Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isOpen
                    ? 'bg-[#b91c1c] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {isOpen ? (
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
              </div>
            </button>

            {/* Answer Content */}
            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100/80">
                <p className="mb-4">{faq.answer}</p>

                {/* Badges */}
                {faq.badges && faq.badges.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {faq.badges.map((b, idx) => {
                      const Icon = b.icon
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border tracking-wider ${b.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{b.text}</span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
