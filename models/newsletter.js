import mongoose from 'mongoose'

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed', 'bounced'],
      default: 'active'
    },
    source: {
      type: String,
      default: 'landing_page'
    },
    ipAddress: String
  },
  {
    timestamps: true
  }
)

// Create index on email for faster queries
newsletterSchema.index({ email: 1 })

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema)

export default Newsletter
