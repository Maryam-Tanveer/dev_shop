import { useState, useEffect } from 'react'
import { MapPin, Plus, Check, Trash2, Edit3, Home, Building2, Phone, Star, X } from 'lucide-react'
import { api } from '../../services/api'

export default function AccountAddresses({ onToast }) {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    label: 'Home',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    isDefault: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const notify = (msg) => {
    if (onToast) onToast(msg)
  }

  // Load addresses on mount
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    api
      .getAddresses()
      .then((res) => {
        if (isMounted && res && Array.isArray(res.data)) {
          setAddresses(res.data)
        }
      })
      .catch((err) => {
        console.warn('[Address Load Error]:', err.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const openAddModal = () => {
    setEditingAddressId(null)
    setFormData({
      label: 'Home',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: '',
      isDefault: addresses.length === 0,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (addr) => {
    setEditingAddressId(addr.id)
    setFormData({
      label: addr.label || 'Home',
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      address: addr.address || '',
      apartment: addr.apartment || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zipCode || '',
      country: addr.country || 'US',
      phone: addr.phone || '',
      isDefault: !!addr.isDefault,
    })
    setIsModalOpen(true)
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to remove this delivery address?')) return

    try {
      const res = await api.deleteAddress(id)
      if (res && res.success) {
        setAddresses(res.data)
        notify('Address removed successfully.')
      } else {
        notify(res?.error || 'Failed to remove address.')
      }
    } catch (err) {
      notify(err.message || 'Error removing address.')
    }
  }

  const handleSetDefault = async (addr) => {
    if (addr.isDefault) return
    try {
      const res = await api.updateAddress(addr.id, { ...addr, isDefault: true })
      if (res && res.success) {
        setAddresses(res.data)
        notify(`"${addr.label}" set as primary default shipping address.`)
      }
    } catch (err) {
      notify(err.message || 'Failed to set default address.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipCode.trim()) {
      notify('Please fill out all required address fields.')
      return
    }

    setIsSubmitting(true)
    try {
      let res
      if (editingAddressId) {
        res = await api.updateAddress(editingAddressId, formData)
      } else {
        res = await api.addAddress(formData)
      }

      if (res && res.success) {
        setAddresses(res.data)
        notify(editingAddressId ? 'Address updated!' : 'New address saved!')
        setIsModalOpen(false)
      } else {
        notify(res?.error || 'Failed to save address.')
      }
    } catch (err) {
      notify(err.message || 'Error saving address.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c81d25] flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">Saved Shipping Addresses</h2>
            <p className="text-xs text-neutral-500">Manage drop delivery destinations and default checkout preferences</p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-[#121212] hover:bg-[#c81d25] text-white text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-400 font-mono animate-pulse">
          Loading authenticated shipping addresses...
        </div>
      ) : addresses.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-2xl p-8">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 mb-1">No Saved Addresses Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            Save your shipping addresses here to enjoy ultra-fast one-click checkout during high-energy drop allocations.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2 rounded-full bg-[#c81d25] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-900 transition"
          >
            Add First Address
          </button>
        </div>
      ) : (
        /* Addresses Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-2xl border p-5 relative transition flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-[#c81d25]/60 bg-red-50/20 shadow-xs'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                      {addr.label?.toLowerCase().includes('office') ? (
                        <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                      ) : (
                        <Home className="w-3.5 h-3.5 text-neutral-500" />
                      )}
                      {addr.label || 'Home'}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#c81d25] text-white">
                        Primary Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(addr)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition"
                      title="Edit Address"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name */}
                {(addr.firstName || addr.lastName) && (
                  <p className="text-xs font-bold text-neutral-800">
                    {addr.firstName} {addr.lastName}
                  </p>
                )}

                {/* Address Lines */}
                <p className="text-xs text-neutral-600 mt-1">
                  {addr.address}
                  {addr.apartment ? `, ${addr.apartment}` : ''}
                </p>
                <p className="text-xs text-neutral-600">
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">
                  {addr.country || 'United States'}
                </p>

                {addr.phone && (
                  <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-neutral-400" />
                    <span>{addr.phone}</span>
                  </p>
                )}
              </div>

              {/* Action: Set as Default */}
              {!addr.isDefault && (
                <div className="pt-4 mt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr)}
                    className="text-[11px] font-bold text-neutral-600 hover:text-[#c81d25] flex items-center gap-1.5 transition"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Set as Primary Shipping</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-neutral-900 tracking-tight mb-1">
              {editingAddressId ? 'Edit Shipping Address' : 'Add New Shipping Address'}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Enter your accurate drop shipment delivery credentials.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                  Address Label (e.g. Home, Studio, Drop Locker)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Home"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="124 Mercer St"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Suite 4B"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NY"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10012"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
                  Phone Number for Delivery SMS
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700 select-none">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded text-[#c81d25] focus:ring-[#c81d25] w-4 h-4 cursor-pointer"
                  />
                  <span>Set as primary default shipping address</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#121212] hover:bg-[#c81d25] text-white text-xs font-extrabold uppercase tracking-wider transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
