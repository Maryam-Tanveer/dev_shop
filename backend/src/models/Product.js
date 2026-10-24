import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    fullTitle: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      default: null,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 10,
    },
    description: {
      type: String,
      default: '',
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [
        {
          name: String,
          hex: String,
          image: String,
        },
      ],
      default: [],
    },
    details: {
      type: [String],
      default: [],
    },
    authenticity: {
      verified: { type: Boolean, default: true },
      nfcScanned: { type: Boolean, default: true },
      certNumber: { type: String, default: 'DEV-VAULT-AUTHENTIC' },
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)
export default Product
