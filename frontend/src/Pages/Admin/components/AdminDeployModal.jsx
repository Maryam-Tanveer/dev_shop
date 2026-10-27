import { useState } from 'react'

export const PRESET_IMAGES = [
  {
    name: 'Travis Scott Jordan 1',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cyberpunk Runner',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Off-White Minimalist',
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Fear of God Boot',
    url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
  },
]

export default function AdminDeployModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  newDrop,
  setNewDrop,
}) {
  const [isDragging, setIsDragging] = useState(false)

  if (!isOpen) return null

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setNewDrop((prev) => ({ ...prev, image: e.target.result }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deploy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-[#16161f] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="text-[10px] font-mono text-[#ff4d5a] uppercase tracking-widest">
              VAULT AIRDROP PROTOCOL
            </div>
            <h2 id="deploy-modal-title" className="text-xl font-black text-white uppercase mt-0.5">
              Deploy Streetwear Drop
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close deploy drop modal"
            className="text-neutral-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="mt-6 space-y-4 text-xs">
          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-drop-title" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                Drop Title *
              </label>
              <input
                id="new-drop-title"
                type="text"
                required
                placeholder="e.g. Travis Scott Jordan 1 Velvet"
                value={newDrop.title}
                onChange={(e) => setNewDrop({ ...newDrop, title: e.target.value })}
                aria-required="true"
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="new-drop-brand" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                Brand *
              </label>
              <input
                id="new-drop-brand"
                type="text"
                required
                placeholder="e.g. Air Jordan, Nike, Yeezy"
                value={newDrop.brand}
                onChange={(e) => setNewDrop({ ...newDrop, brand: e.target.value })}
                aria-required="true"
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-drop-category" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                Category
              </label>
              <select
                id="new-drop-category"
                value={newDrop.category}
                onChange={(e) => setNewDrop({ ...newDrop, category: e.target.value })}
                aria-label="Select product category"
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white focus:outline-none transition"
              >
                <option value="Sneakers">Sneakers</option>
                <option value="Apparel">Apparel</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Hardware">Hardware</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label htmlFor="new-drop-badge" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                Drop Badge
              </label>
              <select
                id="new-drop-badge"
                value={newDrop.badge}
                onChange={(e) => setNewDrop({ ...newDrop, badge: e.target.value })}
                aria-label="Select drop exclusivity badge"
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white focus:outline-none transition"
              >
                <option value="NEW DROP">NEW DROP</option>
                <option value="VIP EXCLUSIVE">VIP EXCLUSIVE</option>
                <option value="LIMITED ARCHIVE">LIMITED ARCHIVE</option>
                <option value="HIGH HEAT">HIGH HEAT</option>
                <option value="DEADSTOCK">DEADSTOCK</option>
              </select>
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-drop-price" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                Drop Retail Price ($) *
              </label>
              <input
                id="new-drop-price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="e.g. 280"
                value={newDrop.price}
                onChange={(e) => setNewDrop({ ...newDrop, price: e.target.value })}
                aria-required="true"
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition font-mono"
              />
            </div>
            <div>
              <label htmlFor="new-drop-original-price" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                Secondary Market / Original ($)
              </label>
              <input
                id="new-drop-original-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 420 (shows discount)"
                value={newDrop.originalPrice}
                onChange={(e) => setNewDrop({ ...newDrop, originalPrice: e.target.value })}
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Stock Count & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-drop-stock" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                Initial Stock Count
              </label>
              <input
                id="new-drop-stock"
                type="number"
                min="0"
                value={newDrop.stock}
                onChange={(e) => setNewDrop({ ...newDrop, stock: e.target.value })}
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white focus:outline-none transition font-mono"
              />
            </div>
            <div>
              <label htmlFor="new-drop-status" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
                Status Telemetry
              </label>
              <select
                id="new-drop-status"
                value={newDrop.stockStatus}
                onChange={(e) => setNewDrop({ ...newDrop, stockStatus: e.target.value })}
                aria-label="Select initial stock status"
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white focus:outline-none transition"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="TBA">TBA (Upcoming)</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>
          </div>

          {/* Image URL & Desktop File Upload */}
          <div className="space-y-3">
            <label htmlFor="new-drop-image-url" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
              Streetwear Visual (Upload File or Enter URL) *
            </label>

            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  id="new-drop-image-url"
                  type="text"
                  required
                  placeholder="Paste image URL or drag & drop file below..."
                  value={newDrop.image}
                  onChange={(e) => setNewDrop({ ...newDrop, image: e.target.value })}
                  aria-required="true"
                  className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition font-mono text-xs"
                />
              </div>
              {newDrop.image && (
                <img
                  src={newDrop.image}
                  alt="Drop visual preview"
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 bg-neutral-900 flex-shrink-0 shadow-md"
                />
              )}
            </div>

            {/* Drag & Drop File Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files[0]
                if (file) handleImageFile(file)
              }}
              onClick={() => document.getElementById('drop-image-file-input')?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload image from computer by dragging and dropping or clicking"
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-[#c81d25] bg-[#c81d25]/15'
                  : 'border-white/10 hover:border-white/25 bg-[#0e0e14]/50'
              }`}
            >
              <input
                type="file"
                id="drop-image-file-input"
                accept="image/*"
                className="hidden"
                aria-label="Upload image file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageFile(file)
                }}
              />
              <div className="text-xs text-neutral-300 font-bold flex items-center justify-center gap-1.5">
                <span aria-hidden="true">📁</span>
                <span>Upload image from computer (Drag & drop or click)</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                Instant preview • Supports PNG, JPG, WEBP, AVIF
              </div>
            </div>

            {/* Preset Image Selectors */}
            <div role="group" aria-label="Quick preset images" className="flex flex-wrap gap-2 items-center pt-1">
              <span className="text-[10px] text-neutral-500 font-mono">Quick visuals:</span>
              {PRESET_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.name}
                  onClick={() => setNewDrop({ ...newDrop, image: img.url })}
                  aria-label={`Select preset visual: ${img.name}`}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-neutral-300 border border-white/5 transition cursor-pointer"
                >
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="new-drop-desc" className="block text-neutral-400 font-mono text-[11px] uppercase mb-1">
              Vault Drop Lore / Description
            </label>
            <textarea
              id="new-drop-desc"
              rows="3"
              placeholder="Enter collector notes, craftsmanship highlights, release details..."
              value={newDrop.description}
              onChange={(e) => setNewDrop({ ...newDrop, description: e.target.value })}
              className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none transition"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel drop deployment"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label={isSubmitting ? 'Deploying drop to vault catalog' : 'Confirm and launch drop'}
              className="bg-[#c81d25] hover:bg-[#a5151c] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition uppercase tracking-wider shadow-lg shadow-[#c81d25]/30 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  Deploying...
                </>
              ) : (
                '🚀 Confirm & Launch Drop'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
