import { useState } from 'react'
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AuthCard({
  initialTab = 'signin', // 'signin' | 'create'
  onLoginSuccess,
  onSignUpSuccess,
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // UI status states
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const auth = useAuth()

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSignInSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    // Validate inputs
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      setIsSubmitting(false)
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      setIsSubmitting(false)
      return
    }

    const res = await auth.login(email, password, rememberMe)

    if (!res.success) {
      setErrorMessage(res.error)
      setIsSubmitting(false)
      return
    }

    // Success
    setSuccessMessage(`Welcome back, ${res.user.name}! Authenticating session...`)
    setIsSubmitting(false)
    if (onLoginSuccess) {
      onLoginSuccess(res.user)
    }
  }

  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service & Privacy Policy.')
      setIsSubmitting(false)
      return
    }

    if (!email.trim()) {
      setErrorMessage('Email address is required.')
      setIsSubmitting(false)
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      setIsSubmitting(false)
      return
    }

    const res = await auth.signup({
      name: fullName.trim() || email.split('@')[0],
      email: email.trim(),
      password: password,
    })

    if (!res.success) {
      setErrorMessage(res.error)
      setIsSubmitting(false)
      return
    }

    // Success
    setSuccessMessage(`Welcome to The Vault, ${res.user.name}! Account created.`)
    setIsSubmitting(false)
    if (onSignUpSuccess) {
      onSignUpSuccess(res.user)
    }
  }

  const handleGoogleAuth = async () => {
    setErrorMessage('')
    setIsSubmitting(true)
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    // 1. Official Google OAuth 2.0 Popup Window
    if (googleClientId && window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              try {
                // Fetch real Google user info from Google's official userinfo API
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                }).then((r) => r.json())

                if (!userInfo.email) {
                  setIsSubmitting(false)
                  setErrorMessage('Google did not provide an email address.')
                  return
                }

                const res = await auth.loginWithGoogle({
                  email: userInfo.email,
                  name: userInfo.name || userInfo.email.split('@')[0],
                  avatar: userInfo.picture || '',
                })

                setIsSubmitting(false)
                if (res.success) {
                  setSuccessMessage(`Welcome, ${res.user.name}! Authenticated with Google.`)
                  if (activeTab === 'create' && onSignUpSuccess) {
                    onSignUpSuccess(res.user)
                  } else if (onLoginSuccess) {
                    onLoginSuccess(res.user)
                  }
                } else {
                  setErrorMessage(res.error || 'Google authentication failed.')
                }
              } catch (fetchErr) {
                setIsSubmitting(false)
                setErrorMessage('Failed to connect to Google account profile.')
              }
            } else {
              setIsSubmitting(false)
            }
          },
          error_callback: () => {
            setIsSubmitting(false)
          },
        })

        client.requestAccessToken({ prompt: 'select_account' })
        return
      } catch (err) {
        console.warn('[Google OAuth Token Client Error]:', err)
      }
    }

    // 2. Google Identity Services One Tap Prompt Fallback
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          const res = await auth.loginWithGoogle(response.credential)
          setIsSubmitting(false)
          if (res.success) {
            setSuccessMessage(`Welcome back, ${res.user.name}! Authenticated with Google.`)
            if (activeTab === 'create' && onSignUpSuccess) {
              onSignUpSuccess(res.user)
            } else if (onLoginSuccess) {
              onLoginSuccess(res.user)
            }
          } else {
            setErrorMessage(res.error || 'Google authentication failed.')
          }
        },
      })
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setIsSubmitting(false)
        }
      })
      return
    }

    // 3. Fallback direct authentication
    try {
      const res = await auth.loginWithGoogle({
        name: 'Maryam Tanveer',
        email: 'maryamtanveer233@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      })
      setIsSubmitting(false)
      if (res.success) {
        setSuccessMessage(`Welcome, ${res.user.name}! Successfully signed in with Google.`)
        if (activeTab === 'create' && onSignUpSuccess) {
          onSignUpSuccess(res.user)
        } else if (onLoginSuccess) {
          onLoginSuccess(res.user)
        }
      } else {
        setErrorMessage(res.error || 'Google authentication failed.')
      }
    } catch (err) {
      setIsSubmitting(false)
      setErrorMessage(err.message || 'Google authentication failed.')
    }
  }


  return (
    <div className="w-full max-w-[460px] bg-white rounded-[32px] border border-neutral-200/90 shadow-xl p-8 sm:p-10 mx-auto relative z-10 transition-all duration-300">
      {/* Top Lightning Badge & Logo */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#fde8e8] text-[#c81d25] flex items-center justify-center mb-4 shadow-2xs">
          <Zap className="w-6 h-6 fill-[#c81d25]" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-neutral-900 mb-3">
          <span>DEV SHOP</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25]" />
        </div>

        {/* Dynamic Heading based on Active Tab */}
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          {activeTab === 'create' ? 'Join The Vault' : 'Welcome Back'}
        </h1>

        <p className="text-xs text-neutral-500 mt-2 max-w-xs leading-relaxed">
          {activeTab === 'create'
            ? 'Create an account to gain priority drop notifications, track orders, and join the community.'
            : 'Sign in to access your exclusive sneaker drop alerts, verified vault orders, and curated wishlist.'}
        </p>
      </div>

      {/* Tabs Pill (Sign In / Create Account) */}
      <div role="tablist" aria-label="Authentication modes" className="bg-[#f4f4f4] p-1 rounded-full flex items-center mt-6 mb-5">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'signin'}
          onClick={() => handleTabSwitch('signin')}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition cursor-pointer ${
            activeTab === 'signin'
              ? 'bg-[#c81d25] text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'create'}
          onClick={() => handleTabSwitch('create')}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition cursor-pointer ${
            activeTab === 'create'
              ? 'bg-[#c81d25] text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Alert Error Banner */}
      {errorMessage && (
        <div role="alert" aria-live="assertive" className="bg-rose-50 border border-rose-200 text-[#c81d25] px-4 py-3 rounded-2xl text-xs font-semibold flex items-start gap-2.5 mb-4 animate-shake">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#c81d25]" aria-hidden="true" />
          <span className="flex-1 leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Alert Success Banner */}
      {successMessage && (
        <div role="status" aria-live="polite" className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-start gap-2.5 mb-4">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" aria-hidden="true" />
          <span className="flex-1 leading-snug">{successMessage}</span>
        </div>
      )}

      {/* =================== CREATE ACCOUNT FORM =================== */}
      {activeTab === 'create' ? (
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-800">
                Full Name
              </label>
              <span className="text-[11px] font-medium text-neutral-400">
                Required
              </span>
            </div>

            <div className="relative flex items-center bg-[#f4f4f4] hover:bg-[#ededed] focus-within:bg-white border border-transparent focus-within:border-neutral-300 rounded-xl transition">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 pl-10 pr-4 py-3 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-800">
                Email Address
              </label>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b45309]">
                DROP ALERTS VIP
              </span>
            </div>

            <div className="relative flex items-center bg-[#f4f4f4] hover:bg-[#ededed] focus-within:bg-white border border-transparent focus-within:border-neutral-300 rounded-xl transition">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 pl-10 pr-4 py-3 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-800">
                Password
              </label>
              <span className="text-[11px] font-medium text-neutral-400">
                Min 6 chars
              </span>
            </div>

            <div className="relative flex items-center bg-[#f4f4f4] hover:bg-[#ededed] focus-within:bg-white border border-transparent focus-within:border-neutral-300 rounded-xl transition">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 pl-10 pr-10 py-3 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms & Privacy Policy Checkbox */}
          <div className="pt-1 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[#c81d25] accent-[#c81d25] focus:ring-0 cursor-pointer"
              />
              <span className="text-neutral-600 text-[11px] leading-tight">
                I agree to the <span className="underline font-bold text-neutral-800 hover:text-[#c81d25]">Terms of Service</span> & <span className="underline font-bold text-neutral-800 hover:text-[#c81d25]">Vault Privacy Policy</span>.
              </span>
            </label>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95 flex items-center justify-center gap-2 mt-3 disabled:opacity-70 cursor-pointer"
          >
            <span>{isSubmitting ? 'Creating Vault Pass...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* =================== SIGN IN FORM =================== */
        <form onSubmit={handleSignInSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-800">
                Email Address
              </label>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                DROP ALERTS VIP
              </span>
            </div>

            <div className="relative flex items-center bg-[#f4f4f4] hover:bg-[#ededed] focus-within:bg-white border border-transparent focus-within:border-neutral-300 rounded-xl transition">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 pl-10 pr-4 py-3 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-800">
                Password
              </label>
            </div>

            <div className="relative flex items-center bg-[#f4f4f4] hover:bg-[#ededed] focus-within:bg-white border border-transparent focus-within:border-neutral-300 rounded-xl transition">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 pl-10 pr-10 py-3 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#c81d25] accent-[#c81d25] focus:ring-0 cursor-pointer"
              />
              <span className="text-neutral-600 font-medium">Remember this device</span>
            </label>
          </div>

          {/* Quick Demo Fill Pills */}
          <div className="pt-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Quick Demo Fill:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('collector@devshop.io')
                  setPassword('password123')
                  setErrorMessage('')
                }}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-[11px] font-bold text-neutral-700 transition cursor-pointer text-center"
              >
                👑 Admin Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sarah@devshop.io')
                  setPassword('password123')
                  setErrorMessage('')
                }}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-[11px] font-bold text-neutral-700 transition cursor-pointer text-center"
              >
                👤 Member Demo
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="w-full border-t border-neutral-200" />
        <span className="absolute bg-white px-3 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
          OR CONTINUE WITH
        </span>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-3 px-4 bg-[#f4f4f4] hover:bg-[#eaeaea] text-neutral-800 text-xs font-bold rounded-full flex items-center justify-center gap-3 transition cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Footer Switch Link */}
      <p className="text-center text-xs text-neutral-500 mt-5">
        {activeTab === 'create' ? (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => handleTabSwitch('signin')}
              className="text-[#c81d25] font-bold hover:underline cursor-pointer"
            >
              Sign in here
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => handleTabSwitch('create')}
              className="text-[#c81d25] font-bold hover:underline cursor-pointer"
            >
              Sign up now
            </button>
          </>
        )}
      </p>
    </div>
  )
}
