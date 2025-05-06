import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
}, {
  timestamps: true,
});

const Customer = mongoose.models.Customer|| mongoose.model("Customer", customerSchema);

export default Customer;
