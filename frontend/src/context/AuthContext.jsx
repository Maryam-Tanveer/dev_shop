import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const JWT_STORAGE_KEY = 'devshop_jwt_token'
const CURRENT_USER_STORAGE_KEY = 'devshop_current_user_v2'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(JWT_STORAGE_KEY) || null
    } catch {
      return null
    }
  })

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(true)

  // Clean up any insecure plain-text users from previous local storage
  useEffect(() => {
    try {
      localStorage.removeItem('devshop_registered_users_v2')
    } catch {}
  }, [])

  // Verify JWT session with backend on mount
  useEffect(() => {
    let isMounted = true
    if (!token) {
      setLoading(false)
      return
    }

    api
      .getMe(token)
      .then((res) => {
        if (isMounted && res.success && res.user) {
          setCurrentUser(res.user)
          localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(res.user))
        }
      })
      .catch((err) => {
        console.warn('[JWT Session Expired or Invalid]:', err.message)
        if (isMounted) {
          setToken(null)
          setCurrentUser(null)
          localStorage.removeItem(JWT_STORAGE_KEY)
          localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [token])

  /**
   * Secure JWT Login via backend
   */
  const login = async (email, password, rememberMe = true) => {
    if (!email || !email.trim()) {
      return { success: false, error: 'Please enter your email address.' }
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' }
    }

    try {
      const res = await api.login({ email, password })
      if (res.success && res.token) {
        setToken(res.token)
        setCurrentUser(res.user)

        if (rememberMe) {
          localStorage.setItem(JWT_STORAGE_KEY, res.token)
          localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(res.user))
        } else {
          sessionStorage.setItem(JWT_STORAGE_KEY, res.token)
        }

        return { success: true, user: res.user, token: res.token }
      }
      return { success: false, error: res.error || 'Authentication failed.' }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed.' }
    }
  }

  /**
   * Secure JWT Signup via backend (passwords bcrypt hashed on backend)
   */
  const signup = async ({ name, email, password }) => {
    if (!email || !email.trim()) {
      return { success: false, error: 'Email address is required.' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return { success: false, error: 'Please provide a valid email format.' }
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long.',
      }
    }

    try {
      const res = await api.register({ name, email, password })
      if (res.success && res.token) {
        setToken(res.token)
        setCurrentUser(res.user)
        localStorage.setItem(JWT_STORAGE_KEY, res.token)
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(res.user))
        return { success: true, user: res.user, token: res.token }
      }
      return { success: false, error: res.error || 'Registration failed.' }
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' }
    }
  }

  /**
   * Secure Google Auth via backend JWT
   */
  const loginWithGoogle = async (email = 'member@google.com', name = 'Vault Member') => {
    try {
      const res = await api.googleAuth({ email, name })
      if (res.success && res.token) {
        setToken(res.token)
        setCurrentUser(res.user)
        localStorage.setItem(JWT_STORAGE_KEY, res.token)
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(res.user))
        return { success: true, user: res.user, token: res.token }
      }
      return { success: false, error: res.error || 'Google login failed.' }
    } catch (err) {
      return { success: false, error: err.message || 'Google login failed.' }
    }
  }

  const logout = () => {
    setToken(null)
    setCurrentUser(null)
    try {
      localStorage.removeItem(JWT_STORAGE_KEY)
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
      sessionStorage.removeItem(JWT_STORAGE_KEY)
      localStorage.removeItem('devshop_registered_users_v2')
    } catch {}
  }

  const updateCurrentUser = (updatedUser) => {
    setCurrentUser((prev) => {
      const merged = { ...prev, ...updatedUser }
      try {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(merged))
      } catch {}
      return merged
    })
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        isAuthenticated: !!currentUser && !!token,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
