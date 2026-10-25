import mongoose from 'mongoose'

let cachedPromise = null

/**
 * Connect to MongoDB database
 * Caches connection promise for serverless and checks connection health
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (cachedPromise) {
    return cachedPromise
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devshop'

  cachedPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })
    .then((conn) => {
      console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`)
      return conn
    })
    .catch((err) => {
      cachedPromise = null
      console.warn(`[DATABASE] Notice: MongoDB connection to ${mongoUri} was not established (${err.message}).`)
      return null
    })

  return cachedPromise
}

export const getDBStatus = () => {
  const isConn = mongoose.connection.readyState === 1
  return {
    connected: isConn,
    readyState: mongoose.connection.readyState,
    status: isConn ? 'connected' : 'offline_fallback',
  }
}
