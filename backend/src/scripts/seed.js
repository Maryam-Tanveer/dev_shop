import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import User from '../models/User.js'
import Order from '../models/Order.js'
import Blog from '../models/Blog.js'
import Collection from '../models/Collection.js'
import Faq from '../models/Faq.js'
import Drop from '../models/Drop.js'
import { RAW_DATABASE, toDetailProduct } from '../data/products/index.js'
import {
  RECENT_DROP_ORDERS,
  BLOGS,
  COLLECTIONS,
  FAQ_DATA,
  HERO_DROP,
  FESTIVAL_PASS,
} from '../data/mockData.js'
import { USERS } from '../data/users.js'

dotenv.config()

const seedDatabase = async () => {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_PROD_SEED) {
    console.error('[SEED BLOCKED] Production database cannot be wiped without explicit ALLOW_PROD_SEED=true in environment.')
    process.exit(1)
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devshop'

  console.log(`[SEED] Connecting to MongoDB: ${mongoUri}`)
  try {
    await mongoose.connect(mongoUri)
    console.log('[SEED] Connected successfully!')

    // 1. Clear existing collections
    console.log('[SEED] Clearing old data...')
    await Product.deleteMany({})
    await User.deleteMany({})
    await Order.deleteMany({})
    await Blog.deleteMany({})
    await Collection.deleteMany({})
    await Faq.deleteMany({})
    await Drop.deleteMany({})

    // 2. Prepare Products
    console.log('[SEED] Inserting products...')
    const productList = Object.values(RAW_DATABASE).map((raw) => {
      const detailed = toDetailProduct(raw)
      return {
        id: detailed.id,
        title: detailed.title,
        fullTitle: detailed.fullTitle || detailed.title,
        brand: detailed.brand || 'Dev Shop',
        category: detailed.category || 'Streetwear',
        price: detailed.price || 150,
        originalPrice: detailed.originalPrice || null,
        rating: detailed.rating || 4.9,
        reviewsCount: detailed.reviews || 42,
        image: detailed.image,
        images: (detailed.thumbnails || []).map((t) => t.image),
        badge: detailed.badge,
        inStock: detailed.inStock ?? true,
        stockCount: detailed.stock || 25,
        description: detailed.description || '',
        sizes: (detailed.sizes || []).map((s) => (typeof s === 'string' ? s : s.size)),
        colors: (detailed.colorways || []).map((c) => ({
          name: c.name,
          hex: c.color,
          image: detailed.image,
        })),
        details: [
          detailed.feature1Title,
          detailed.feature2Title,
          detailed.releaseCode,
        ].filter(Boolean),
        authenticity: {
          verified: true,
          nfcScanned: true,
          certNumber: detailed.dropCode || 'DEV-VAULT-AUTHENTIC',
        },
      }
    })

    const insertedProducts = await Product.insertMany(productList)
    console.log(`[SEED] ✓ Inserted ${insertedProducts.length} products.`)

    // 3. Prepare Users
    console.log('[SEED] Inserting default vault users...')
    const userList = USERS.map((u) => ({
      name: u.name,
      email: u.email,
      password: process.env.DEV_SEED_PASSWORD || 'password123',
      role: u.role || 'member',
      avatar: u.avatar || '',
      memberTier: u.tier || 'Core Vault Member',
    }))

    for (const userData of userList) {
      await User.create(userData)
    }
    console.log(`[SEED] ✓ Inserted ${userList.length} users with credentials.`)

    // 4. Prepare Orders
    console.log('[SEED] Inserting sample orders...')
    const orderList = RECENT_DROP_ORDERS.map((o) => {
      const orderStatus = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(o.status)
        ? o.status
        : 'Confirmed'

      return {
        orderNumber: o.orderNumber || o.id,
        userEmail: 'collector@devshop.io',
        items: (o.items || []).map((item) => ({
          productId: item.id || 'deal-1',
          title: item.title || item.name || 'Drop Item',
          image: item.image || '',
          price: item.price || 180,
          quantity: item.qty || item.quantity || 1,
          size: item.size || 'M',
          colorway: item.color || 'Default',
        })),
        shippingAddress: {
          firstName: 'Alex',
          lastName: 'Mercer',
          address: '124 Mercer St',
          city: 'New York',
          state: 'NY',
          zipCode: '10012',
          country: 'US',
        },
        subtotal: o.total || 210,
        totalAmount: o.total || 210,
        status: orderStatus,
        paymentStatus: 'paid',
        carrier: o.carrier || 'FedEx Priority Air',
        estimatedDelivery: '2-4 Business Days',
        statusHistory: [
          { status: 'Confirmed', at: new Date(Date.now() - 86400000 * 2) },
          { status: orderStatus, at: new Date() },
        ],
        trackingNumber: o.tracking || 'DEV-TRK-88912',
      }
    })

    if (orderList.length > 0) {
      await Order.insertMany(orderList)
      console.log(`[SEED] ✓ Inserted ${orderList.length} sample orders.`)
    }

    // 5. Prepare Blogs
    console.log('[SEED] Inserting blogs...')
    const insertedBlogs = await Blog.insertMany(BLOGS)
    console.log(`[SEED] ✓ Inserted ${insertedBlogs.length} blogs.`)

    // 6. Prepare Collections
    console.log('[SEED] Inserting collections...')
    const insertedCollections = await Collection.insertMany(COLLECTIONS)
    console.log(`[SEED] ✓ Inserted ${insertedCollections.length} collections.`)

    // 7. Prepare FAQs
    console.log('[SEED] Inserting FAQs...')
    const insertedFaqs = await Faq.insertMany(FAQ_DATA)
    console.log(`[SEED] ✓ Inserted ${insertedFaqs.length} FAQs.`)

    // 8. Prepare Drops
    console.log('[SEED] Inserting hero drop and festival pass...')
    await Drop.insertMany([
      { type: 'hero', ...HERO_DROP },
      { type: 'festival-pass', ...FESTIVAL_PASS },
    ])
    console.log('[SEED] ✓ Inserted Drops into DB.')

    console.log('[SEED] 🚀 Database seeding completed successfully!')
    process.exit(0)
  } catch (err) {
    console.error('[SEED ERROR] Failed to seed database:', err)
    process.exit(1)
  }
}

seedDatabase()
