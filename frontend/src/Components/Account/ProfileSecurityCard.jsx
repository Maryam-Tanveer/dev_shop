import { useState, useEffect } from 'react'
import { User, Shield, Lock, Phone, FileText, CheckCircle2, AlertCircle, Camera, Save, KeyRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
]

export default function ProfileSecurityCard({ onToast }) {
  const { currentUser, updateCurrentUser } = useAuth()

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || '')
  const [avatar, setAvatar] = useState(currentUser?.avatar || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [bio, setBio] = useState(currentUser?.bio || '')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '')
      setAvatar(currentUser.avatar || '')
      setPhone(currentUser.phone || '')
      setBio(currentUser.bio || '')
    }
  }, [currentUser])

  const notify = (msg) => {
    if (onToast) onToast(msg)
  }

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      notify('Name is required.')
      return
    }

    setIsUpdatingProfile(true)
    try {
      const res = await api.updateProfile({
        name: name.trim(),
        avatar: avatar.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      })

      if (res && res.success) {
        updateCurrentUser(res.data)
        notify('Profile updated successfully!')
      } else {
        notify(res?.error || 'Failed to update profile.')
      }
    } catch (err) {
      notify(err.message || 'Error updating profile.')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!currentPassword) {
      notify('Please enter your current password.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      notify('New password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      notify('New password and confirm password do not match.')
      return
    }

    setIsChangingPassword(true)
    try {
      const res = await api.changePassword({
        currentPassword,
        newPassword,
      })

      if (res && res.success) {
        notify('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        notify(res?.error || 'Failed to change password.')
      }
    } catch (err) {
      notify(err.message || 'Error changing password.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Profile Information Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c81d25] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-neutral-900 tracking-tight">Collector Profile</h2>
              <p className="text-xs text-neutral-500">Manage your vault handle, avatar, and contact info</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full uppercase tracking-wider">
            {currentUser?.memberTier || 'Core Member'}
          </span>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Avatar Preview & Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
              Profile Avatar
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-300 shadow-sm bg-neutral-100">
                  {avatar ? (
                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-white font-black text-2xl">
                      {name.slice(0, 2).toUpperCase() || 'DS'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-[#c81d25] transition"
                  />
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="text-xs text-neutral-400 hover:text-neutral-700 px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Preset Avatars */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1.5">
                    Or select a vault avatar preset:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition ${
                          avatar === preset ? 'border-[#c81d25] scale-110 shadow-sm' : 'border-transparent hover:border-neutral-300'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-900 focus:outline-none focus:border-[#c81d25] transition"
                placeholder="Marcus Vance"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone & Bio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#c81d25] transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Collector Bio / Note
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#c81d25] transition"
                placeholder="Archival streetwear enthusiast, Size 10.5 US"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-6 py-3 rounded-full bg-[#121212] hover:bg-[#c81d25] text-white text-xs font-extrabold uppercase tracking-wider transition shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Security & Password Change Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-neutral-900 tracking-tight">Security & Credentials</h2>
              <p className="text-xs text-neutral-500">Update your account authentication password securely</p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#c81d25] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#c81d25] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#c81d25] transition"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-[#c81d25] text-white text-xs font-extrabold uppercase tracking-wider transition shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
