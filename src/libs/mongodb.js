import mongoose from 'mongoose'
// const database =
  // 'mongodb+srv://2223016:N6bVPiFwmE5hhoI5@cluster0.3dvrp.mongodb.net/Inventoryservices?retryWrites=true&w=majority'
const database = "mongodb://localhost:27017/Inventoryservices";
let isConnected = false

export const connectToDB = async () => {
  if (isConnected) return
  try {
    await mongoose.connect(database)
    isConnected = true
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error('MongoDB connection failed')
  }
}
