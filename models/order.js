// const mongoose = require('mongoose')
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Or String if you're not using ObjectIds
    required: true,
    ref: 'Product'
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
})

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    customerName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    productList: [ProductSchema],
    date: {
      type: Date,
      default: Date.now
    },
    fulfillmentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
)

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)
