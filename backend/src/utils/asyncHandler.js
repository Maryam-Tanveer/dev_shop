/**
 * Wraps asynchronous route handlers to eliminate try/catch blocks
 * Automatically forwards any thrown error or rejection to Express next(err)
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
