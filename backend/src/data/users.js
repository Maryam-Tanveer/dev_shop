import bcrypt from 'bcryptjs'

// Pre-hashed password for 'password123' with salt rounds 10
const DEFAULT_HASH = bcrypt.hashSync('password123', 10)

export const USERS = [
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    email: 'collector@devshop.io',
    passwordHash: DEFAULT_HASH,
    tier: 'VAULT TIER VIP MEMBER',
    joined: 'Nov 2022',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 382-9102',
    bio: 'Sneakerhead & Archival Streetwear Collector based in NYC.',
    priorityAccess: true,
    addresses: [
      {
        id: 'addr-default-1',
        label: 'Home (Primary)',
        firstName: 'Marcus',
        lastName: 'Vance',
        address: '124 Mercer St',
        apartment: 'Suite 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10012',
        country: 'US',
        phone: '+1 (555) 382-9102',
        isDefault: true,
      },
      {
        id: 'addr-office-2',
        label: 'Design Studio',
        firstName: 'Marcus',
        lastName: 'Vance',
        address: '568 Broadway',
        apartment: 'Floor 8',
        city: 'New York',
        state: 'NY',
        zipCode: '10012',
        country: 'US',
        phone: '+1 (555) 382-9102',
        isDefault: false,
      },
    ],
  },
  {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah@devshop.io',
    passwordHash: DEFAULT_HASH,
    tier: 'GOLD MEMBER',
    joined: 'Jan 2023',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 891-2344',
    bio: 'Curator & High-tops enthusiast.',
    priorityAccess: true,
    addresses: [
      {
        id: 'addr-sarah-1',
        label: 'Residence',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        address: '742 Evergreen Terrace',
        apartment: '',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        country: 'US',
        phone: '+1 (555) 891-2344',
        isDefault: true,
      },
    ],
  },
]

export const findUserByEmail = (email) => {
  if (!email) return null
  const normalized = email.trim().toLowerCase()
  return USERS.find((u) => u.email.toLowerCase() === normalized) || null
}

export const findUserById = (id) => {
  if (!id) return null
  return USERS.find((u) => u.id === id) || null
}

export const createUser = async ({ name, email, password, avatar, tier }) => {
  const normalized = email.trim().toLowerCase()
  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = {
    id: `user-${Date.now()}`,
    name: name && name.trim() ? name.trim() : email.split('@')[0],
    email: normalized,
    passwordHash,
    tier: tier || 'VAULT ROOKIE MEMBER',
    joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    avatar: avatar || null,
    phone: '',
    bio: '',
    priorityAccess: false,
    addresses: [],
  }

  USERS.push(newUser)
  return newUser
}

export const updateUserProfile = (id, updates) => {
  const user = findUserById(id)
  if (!user) return null

  if (updates.name !== undefined) user.name = updates.name.trim()
  if (updates.avatar !== undefined) user.avatar = updates.avatar
  if (updates.phone !== undefined) user.phone = updates.phone.trim()
  if (updates.bio !== undefined) user.bio = updates.bio.trim()

  return sanitizeUser(user)
}

export const changeUserPassword = async (id, currentPassword, newPassword) => {
  const user = findUserById(id)
  if (!user) return { success: false, error: 'User not found' }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!isMatch) return { success: false, error: 'Current password is incorrect' }

  user.passwordHash = await bcrypt.hash(newPassword, 10)
  return { success: true }
}

export const addUserAddress = (userId, addressData) => {
  const user = findUserById(userId)
  if (!user) return null
  if (!user.addresses) user.addresses = []

  const newAddr = {
    id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...addressData,
  }

  if (newAddr.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false))
  } else if (user.addresses.length === 0) {
    newAddr.isDefault = true
  }

  user.addresses.push(newAddr)
  return user.addresses
}

export const updateUserAddress = (userId, addressId, addressData) => {
  const user = findUserById(userId)
  if (!user || !user.addresses) return null

  const index = user.addresses.findIndex((a) => a.id === addressId)
  if (index === -1) return null

  if (addressData.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false))
  }

  user.addresses[index] = {
    ...user.addresses[index],
    ...addressData,
    id: addressId,
  }

  return user.addresses
}

export const deleteUserAddress = (userId, addressId) => {
  const user = findUserById(userId)
  if (!user || !user.addresses) return null

  const wasDefault = user.addresses.find((a) => a.id === addressId)?.isDefault
  user.addresses = user.addresses.filter((a) => a.id !== addressId)

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true
  }

  return user.addresses
}

export const comparePassword = async (plainPassword, hash) => {
  return bcrypt.compare(plainPassword, hash)
}

/**
 * Returns user profile without sensitive password hash
 */
export const sanitizeUser = (user) => {
  if (!user) return null
  const { passwordHash, ...safeUser } = user
  return safeUser
}
