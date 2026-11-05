import mongoose from 'mongoose'

const dropSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['hero', 'festival-pass'],
      unique: true,
      index: true,
    },
    id: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    edition: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    retailPrice: {
      type: Number,
      default: 0,
    },
    series: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    certified: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: '',
    },
    allocationCap: {
      type: String,
      default: '',
    },
    claimedTier: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const Drop = mongoose.models.Drop || mongoose.model('Drop', dropSchema)
export default Drop
