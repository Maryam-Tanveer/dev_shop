import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

/**
 * Generic useAsync hook for data fetching
 */
export function useAsync(asyncFunction, immediate = true, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const response = await asyncFunction(...args)
      setData(response)
      return response
    } catch (err) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, refetch: execute }
}

export function useProducts(params) {
  return useAsync(() => api.getProducts(params), true, [JSON.stringify(params)])
}

export function useProduct(id) {
  return useAsync(() => api.getProductById(id), true, [id])
}

export function useDeals() {
  return useAsync(() => api.getDeals(), true, [])
}

export function useRelatedProducts(id) {
  return useAsync(() => api.getRelatedProducts(id), true, [id])
}

export function useCollections() {
  return useAsync(() => api.getCollections(), true, [])
}

export function useBlogs() {
  return useAsync(() => api.getBlogs(), true, [])
}

export function useFaqs(category) {
  return useAsync(() => api.getFaqs(category), true, [category])
}

export function useOrders() {
  return useAsync(() => api.getOrders(), true, [])
}

export function useHeroDrop() {
  return useAsync(() => api.getHeroDrop(), true, [])
}
