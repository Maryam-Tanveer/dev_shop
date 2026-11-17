import mongoose from 'mongoose'

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: 'Valued Collector',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    topic: {
      type: String,
      default: 'General Inquiry',
    },
    orderNumber: {
      type: String,
      default: null,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema)
