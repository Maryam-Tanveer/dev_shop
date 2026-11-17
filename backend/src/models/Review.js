import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      index: true,
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      maxlength: 100,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Review content is required'],
      trim: true,
      maxlength: 2000,
    },
    size: {
      type: String,
      trim: true,
      default: '',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Review = mongoose.model('Review', reviewSchema)
