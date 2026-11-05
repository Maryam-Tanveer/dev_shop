import { Package, Heart, MapPin, Shield, Award } from 'lucide-react'

export const DASHBOARD_TABS = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Profile & Security', icon: Shield },
  { id: 'rewards', label: 'Tier Rewards', icon: Award },
]
