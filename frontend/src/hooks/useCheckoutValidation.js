import { useState } from 'react'

/**
 * Custom React Hook for Checkout Form Validation
 * Strictly enforces valid email, phone number, city, province/state, and name.
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

    // 2. Strict Phone Number Validation (10-15 digits, digits, +, -, () only)
    const rawPhone = String(phone || '').trim()
    const digitsOnly = rawPhone.replace(/\D/g, '')
    const allowedChars = /^[+]?[0-9\s\-().]+$/
    if (!rawPhone) {
      newErrors.phone = 'Phone number is required for dispatch.'
    } else if (!allowedChars.test(rawPhone) || digitsOnly.length < 10 || digitsOnly.length > 15) {
      newErrors.phone = 'Please enter a valid 10-15 digit phone number (e.g. 03001234567 or +92 300 1234567).'
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

    // 5. City Validation (letters only, no numbers or symbols, 2-50 characters)
    const cleanCity = String(city || '').trim()
    const cityRegex = /^[a-zA-Z\s'.-]{2,50}$/
    if (!cleanCity) {
      newErrors.city = 'City name is required.'
    } else if (!cityRegex.test(cleanCity) || /^\d+$/.test(cleanCity)) {
      newErrors.city = 'Please enter a valid City name (letters only, e.g. Lahore, Karachi, Islamabad).'
    }

    // 6. State / Province Validation (letters only, 2-50 characters)
    const cleanState = String(state || '').trim()
    const stateRegex = /^[a-zA-Z\s'.-]{2,50}$/
    if (!cleanState) {
      newErrors.state = 'State / Province is required.'
    } else if (!stateRegex.test(cleanState) || /^\d+$/.test(cleanState)) {
      newErrors.state = 'Please enter a valid Province / State (letters only, e.g. Punjab, Sindh).'
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
