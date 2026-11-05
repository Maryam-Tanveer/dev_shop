import mongoose from 'mongoose'

const collectionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    series: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    ctaText: {
      type: String,
      default: 'Explore Drop',
    },
    subTag: {
      type: String,
      default: '',
    },
    productId: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'all',
      index: true,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema)
export default Collection
