import { useState, useEffect } from 'react'
import { Flame, Star, ShoppingBag, Zap, Check, ShieldCheck, Truck, RotateCcw, Ruler } from 'lucide-react'

export default function ProductInfo({ product, onAddToCart, onBuyNow, onSizeGuide }) {
  const colorways = product?.colorways || [
    { id: 'default', name: 'Standard Edition', color: '#171717' }
  ]

  const sizes = product?.sizes || [
    { size: '8.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
    { size: '8.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
    { size: '9.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
    { size: '9.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
    { size: '10.0', status: 'In Stock', badgeColor: 'text-neutral-400' },
    { size: '10.5', status: 'In Stock', badgeColor: 'text-neutral-400' },
    { size: '11.0', status: 'In Stock', badgeColor: 'text-neutral-400' }
  ]

  const [selectedColor, setSelectedColor] = useState(colorways[0])
  const [selectedSize, setSelectedSize] = useState(sizes[2]?.size || sizes[0]?.size || '9.0')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (colorways && colorways.length > 0) {
      setSelectedColor(colorways[0])
    }
    if (sizes && sizes.length > 0) {
      setSelectedSize(sizes[2]?.size || sizes[0]?.size)
    }
  }, [product?.id])

  const handleAdd = () => {
    setAdded(true)
    if (onAddToCart) {
      onAddToCart({
        id: product?.id || 'item',
        brand: product?.brand || 'Brand',
        title: product?.title || 'Product',
        colorway: selectedColor?.name,
        size: selectedSize,
        price: product?.price || 100,
        image: product?.thumbnails?.[0]?.image || product?.image
      })
    }
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuy = () => {
    if (onBuyNow) {
      onBuyNow({
        id: product?.id || 'item',
        brand: product?.brand || 'Brand',
        title: product?.title || 'Product',
        colorway: selectedColor?.name,
        size: selectedSize,
        price: product?.price || 100,
        image: product?.thumbnails?.[0]?.image || product?.image
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs">
      {/* Header & Badges */}
      <div>
        {product?.isNew && (
          <div className="inline-flex items-center gap-1.5 bg-[#fde8e8] text-[#c81d25] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3 border border-[#fecaca]">
            <Flame className="w-3.5 h-3.5 fill-[#c81d25]" />
            <span>NEW ARRIVAL!</span>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
          {product?.title || 'The Collection Snowboard: Liquid'}
        </h1>

        {/* Creator & Reviews Row */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
            <span>{product?.brand || 'Nike Lab'}</span>
            <span className="text-[#0284c7] font-bold">verified</span>
          </div>

          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-neutral-900">{product?.rating || 5.0}</span>
            <span className="text-neutral-400 font-normal underline cursor-pointer">({product?.reviews || 42} Reviews)</span>
          </div>

          {product?.soldCount && (
            <div className="flex items-center gap-1 text-neutral-500 text-[11px] font-medium">
              <ShoppingBag className="w-3.5 h-3.5 text-[#c81d25]" />
              <span><strong className="text-neutral-900">{product.soldCount}</strong> ITEMS SOLD</span>
            </div>
          )}
        </div>
      </div>

      {/* Price Box */}
      <div className="p-4 rounded-2xl bg-[#fcfbfa] border border-neutral-200/80 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-0.5">
            RELEASE PRICE
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#c81d25]">
              ${product?.price ? product.price.toFixed(2) : '180.00'}
            </span>
            {product?.originalPrice && (
              <span className="text-sm text-neutral-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {product?.saveAmount && (
          <span className="bg-[#fde8e8] text-[#c81d25] text-xs font-extrabold px-3 py-1 rounded-full border border-[#fecaca]">
            {product.saveAmount}
          </span>
        )}
      </div>

      {/* Colorway Selection */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="font-extrabold uppercase tracking-wider text-neutral-700">COLORWAY:</span>
          <span className="font-medium text-neutral-500">{selectedColor?.name}</span>
        </div>

        <div className="flex items-center gap-3">
          {colorways.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedColor(c)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                selectedColor?.id === c.id
                  ? 'ring-2 ring-offset-2 ring-[#c81d25] scale-105'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.color }}
              title={c.name}
            >
              {selectedColor?.id === c.id && <Check className="w-4 h-4 text-white stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Available Sizes */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="font-extrabold uppercase tracking-wider text-neutral-800">
            AVAILABLE SIZES (US MEN)
          </span>
          <button
            onClick={onSizeGuide}
            className="flex items-center gap-1 text-[#c81d25] font-bold text-xs hover:underline"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {sizes.map((s) => {
            const isSelected = selectedSize === s.size
            return (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s.size)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition text-center ${
                  isSelected
                    ? 'border-[#c81d25] bg-rose-50/40 ring-1 ring-[#c81d25]'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <span className={`text-xs font-black ${isSelected ? 'text-[#c81d25]' : 'text-neutral-900'}`}>
                  {s.size}
                </span>
                <span className={`text-[9px] ${s.badgeColor}`}>
                  {s.status}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={handleBuy}
          className="w-full py-3.5 px-6 rounded-full bg-[#c81d25] hover:bg-[#a8161d] text-white font-black text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 active:scale-95"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Buy Now</span>
        </button>

        <button
          onClick={handleAdd}
          className={`w-full py-3.5 px-6 rounded-full border text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 active:scale-95 ${
            added
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-300'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#c81d25]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Guarantees Strip */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-100 text-center">
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-4 h-4 text-[#c81d25] mb-1" />
          <span className="text-[10px] font-black uppercase text-neutral-900">100% AUTHENTIC</span>
          <span className="text-[9px] text-neutral-400">Verified In-House</span>
        </div>

        <div className="flex flex-col items-center border-x border-neutral-200/80 px-1">
          <Truck className="w-4 h-4 text-[#c81d25] mb-1" />
          <span className="text-[10px] font-black uppercase text-neutral-900">EXPRESS DROP</span>
          <span className="text-[9px] text-neutral-400">Ships in 24 Hours</span>
        </div>

        <div className="flex flex-col items-center">
          <RotateCcw className="w-4 h-4 text-[#c81d25] mb-1" />
          <span className="text-[10px] font-black uppercase text-neutral-900">EASY RETURNS</span>
          <span className="text-[9px] text-neutral-400">14-Day Free Exchange</span>
        </div>
      </div>
    </div>
  )
}
