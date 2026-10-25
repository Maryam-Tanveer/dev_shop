import { useState, useEffect } from 'react'
import { Truck, ChevronDown } from 'lucide-react'

export default function ShippingAddressCard({
  initialAddress,
  onChange
}) {
  const [formData, setFormData] = useState({
    firstName: initialAddress?.firstName || '',
    lastName: initialAddress?.lastName || '',
    streetAddress: initialAddress?.address || initialAddress?.streetAddress || '',
    apartment: initialAddress?.apartment || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    postalCode: initialAddress?.zipCode || initialAddress?.postalCode || '',
    country: initialAddress?.country || 'United States'
  })

  useEffect(() => {
    if (initialAddress) {
      setFormData((prev) => ({
        firstName: initialAddress.firstName !== undefined ? initialAddress.firstName : prev.firstName,
        lastName: initialAddress.lastName !== undefined ? initialAddress.lastName : prev.lastName,
        streetAddress: initialAddress.address || initialAddress.streetAddress || prev.streetAddress,
        apartment: initialAddress.apartment || prev.apartment,
        city: initialAddress.city || prev.city,
        state: initialAddress.state || prev.state,
        postalCode: initialAddress.zipCode || initialAddress.postalCode || prev.postalCode,
        country: initialAddress.country || prev.country
      }))
    }
  }, [initialAddress])

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    if (onChange) onChange(updated)
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25]">
          <Truck className="w-4 h-4 stroke-[2.2]" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
          Shipping Address
        </h2>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
            Street Address
          </label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
            placeholder="Street Address, P.O. Box"
          />
        </div>

        {/* Apartment / Suite */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
            Apartment, Suite, Unit (Optional)
          </label>
          <input
            type="text"
            value={formData.apartment}
            onChange={(e) => handleChange('apartment', e.target.value)}
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
            placeholder="Apartment, suite, unit, etc."
          />
        </div>

        {/* City, State, Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              State / Province
            </label>
            <div className="relative">
              <select
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none appearance-none cursor-pointer pr-10"
              >
                <option value="New York (NY)">New York (NY)</option>
                <option value="California (CA)">California (CA)</option>
                <option value="Texas (TX)">Texas (TX)</option>
                <option value="Florida (FL)">Florida (FL)</option>
                <option value="Illinois (IL)">Illinois (IL)</option>
                <option value="Washington (WA)">Washington (WA)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
              placeholder="10013"
            />
          </div>
        </div>

        {/* Country / Region */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
            Country / Region
          </label>
          <div className="relative">
            <select
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none appearance-none cursor-pointer pr-10"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="Australia">Australia</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
