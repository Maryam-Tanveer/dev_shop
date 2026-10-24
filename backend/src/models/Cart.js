import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'M',
  },
  colorway: {
    type: String,
    default: 'Default',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
})

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    guestId: {
      type: String,
      default: null,
      index: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
)

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema)
export default Cart
