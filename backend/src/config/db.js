import mongoose from 'mongoose'

let isConnected = false

/**
 * Connect to MongoDB database
 * Falls back gracefully to memory repository if MongoDB is not locally running
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devshop'

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500, // Timeout fast if no local MongoDB instance
    })

    isConnected = true
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`)
    return conn
  } catch (err) {
    isConnected = false
    console.warn(`[DATABASE] Notice: MongoDB connection to ${mongoUri} was not established (${err.message}).`)
    console.warn(`[DATABASE] Operating in hybrid repository mode with high-performance in-memory persistence.`)
    return null
  }
}

export const getDBStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
  status: isConnected ? 'connected' : 'offline_fallback',
})
