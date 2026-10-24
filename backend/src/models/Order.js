import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        size: { type: String, default: 'Standard' },
        colorway: { type: String, default: 'Original' },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      address: String,
      apartment: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'US' },
    },
    shippingMethod: {
      type: String,
      enum: ['standard', 'priority'],
      default: 'standard',
    },
    paymentMethod: {
      type: String,
      default: 'credit-card',
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Confirmed',
    },
    trackingNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
export default Order
