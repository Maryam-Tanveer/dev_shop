import AppError from '../utils/AppError.js'

/**
 * Express middleware for schema validation using Joi
 * Supports schemas containing { body, params, query } or direct body schema
 */
export const validate = (schema) => (req, res, next) => {
  if (!schema) return next()

  const actualSchema =
    schema.body || schema.params || schema.query
      ? schema
      : { body: schema }

  const errors = []

  for (const key of ['body', 'params', 'query']) {
    if (actualSchema[key]) {
      const { error, value } = actualSchema[key].validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
      })

      if (error) {
        error.details.forEach((d) => {
          errors.push({
            field: d.path.join('.'),
            message: d.message.replace(/['"]/g, ''),
            target: key,
          })
        })
      } else {
        req[key] = value
      }
    }
  }

  if (errors.length > 0) {
    const primaryMsg = errors[0].message
    return next(new AppError(`Validation error: ${primaryMsg}`, 400, errors))
  }

  next()
}

export default validate
