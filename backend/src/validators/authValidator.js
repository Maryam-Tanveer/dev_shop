import Joi from 'joi'

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required',
    }),
    email: Joi.string().trim().email().required().messages({
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).max(128).required().messages({
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
  }),
}

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().required().messages({
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required',
    }),
  }),
}

export const googleAuthSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    name: Joi.string().trim().default('Vault Member'),
  }),
}
