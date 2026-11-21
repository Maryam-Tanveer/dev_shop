import { useState } from 'react'
import {
  validateCityForProvince,
  validatePakistanPhone,
} from '../utils/geoData'

/**
 * Custom React Hook for Checkout Form Validation
 * Strictly enforces:
 * - Pakistani Phone Number: +92 300 1234567
 * - Province-specific City: City MUST belong to the selected Province
 * - Valid Email, Name, Address
 */
export function useCheckoutValidation() {
  const [errors, setErrors] = useState({})

  const validate = ({
    email = '',
    phone = '',
    firstName = '',
    streetAddress = '',
    city = '',
    state = '',
    country = 'Pakistan',
  }) => {
    const newErrors = {}

    // 1. Strict Email Validation
    const cleanEmail = String(email || '').trim()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!cleanEmail) {
      newErrors.email = 'Email address is required.'
    } else if (!emailRegex.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@gmail.com).'
    }

    // 2. Strict Phone Number: +92 300 1234567 format
    const phoneRes = validatePakistanPhone(phone)
    if (!phoneRes.isValid) {
      newErrors.phone = phoneRes.message
    }

    // 3. First Name Validation (letters only, 2-40 characters)
    const cleanFirstName = String(firstName || '').trim()
    const nameRegex = /^[a-zA-Z\s'-]{2,40}$/
    if (!cleanFirstName) {
      newErrors.firstName = 'First Name is required.'
    } else if (!nameRegex.test(cleanFirstName)) {
      newErrors.firstName = 'First Name must contain letters only (minimum 2 characters).'
    }

    // 4. Street Address Validation (minimum 5 characters)
    const cleanAddress = String(streetAddress || '').trim()
    if (!cleanAddress) {
      newErrors.streetAddress = 'Street Address is required.'
    } else if (cleanAddress.length < 5) {
      newErrors.streetAddress = 'Please enter a complete street address (minimum 5 characters).'
    }

    // 5. State / Province Validation
    const cleanState = String(state || '').trim()
    if (!cleanState) {
      newErrors.state = 'State / Province is required.'
    }

    // 6. Province-Specific City Validation (City MUST belong to the selected Province)
    if (!newErrors.state) {
      const cityRes = validateCityForProvince(city, state, country)
      if (!cityRes.isValid) {
        newErrors.city = cityRes.message
      }
    } else if (!String(city || '').trim()) {
      newErrors.city = 'City name is required.'
    }

    setErrors(newErrors)

    const isValid = Object.keys(newErrors).length === 0
    const firstKey = Object.keys(newErrors)[0]
    const firstErrorMessage = firstKey ? newErrors[firstKey] : null

    return {
      isValid,
      errors: newErrors,
      firstErrorMessage,
    }
  }

  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const updated = { ...prev }
      delete updated[field]
      return updated
    })
  }

  return {
    errors,
    setErrors,
    validate,
    clearFieldError,
  }
}
