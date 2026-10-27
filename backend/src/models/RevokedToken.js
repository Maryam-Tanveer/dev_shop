import mongoose from 'mongoose'

const revokedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatically deleted by MongoDB when expired
    },
  },
  { timestamps: true }
)

const RevokedToken =
  mongoose.models.RevokedToken || mongoose.model('RevokedToken', revokedTokenSchema)

export default RevokedToken
