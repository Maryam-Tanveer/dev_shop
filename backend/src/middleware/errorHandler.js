import AppError from '../utils/AppError.js'

/**
 * Handle Mongoose CastError (invalid ObjectId / parameter)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

/**
 * Handle MongoDB duplicate fields (E11000)
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field'
  const value = err.keyValue ? err.keyValue[field] : ''
  const message = `An item with ${field} '${value}' already exists.`
  return new AppError(message, 409)
}

/**
 * Handle Mongoose ValidationErrors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }))
  const message = `Invalid input data: ${errors.map((e) => e.message).join('. ')}`
  return new AppError(message, 400, errors)
}

/**
 * Handle JWT Errors
 */
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401)
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401)

/**
 * Send error response in development environment
 */
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err.message,
    details: err.details || null,
    stack: err.stack,
  })
}

/**
 * Send error response in production environment
 */
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err.message,
      details: err.details || null,
    })
  }

  // Programming or unknown error: don't leak details to client
  console.error('[ERROR 💥]:', err)
  res.status(500).json({
    success: false,
    status: 'error',
    error: 'Internal Server Error. Please try again later.',
  })
}

/**
 * Global Express Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    let error = err
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorDev(error, req, res)
  } else {
    let error = { ...err }
    error.message = err.message
    error.name = err.name
    error.code = err.code

    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, req, res)
  }
}

export default errorHandler
