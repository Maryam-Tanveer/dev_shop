import Joi from 'joi'

export const priceCartSchema = {
  body: Joi.object({
    shippingMethod: Joi.string().allow('', null).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required().messages({
            'any.required': 'productId is required for each cart item',
          }),
          size: Joi.string().allow('', null).default('M'),
          colorway: Joi.string().allow('', null).default('Default'),
          qty: Joi.number().integer().min(1).max(99).default(1),
          quantity: Joi.number().integer().min(1).max(99).optional(),
        })
      )
      .default([]),
  }),
}

export const syncCartSchema = {
  body: Joi.object({
    guestId: Joi.string().allow('', null).optional(),
    shippingMethod: Joi.string().allow('', null).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          size: Joi.string().allow('', null).default('M'),
          colorway: Joi.string().allow('', null).default('Default'),
          qty: Joi.number().integer().min(1).max(99).optional(),
          quantity: Joi.number().integer().min(1).max(99).optional(),
        })
      )
      .default([]),
  }),
}
