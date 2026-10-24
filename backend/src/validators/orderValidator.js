import Joi from 'joi'

export const createOrderSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    items: Joi.array()
      .min(1)
      .items(
        Joi.object({
          productId: Joi.string().required(),
          title: Joi.string().required(),
          price: Joi.number().min(0).required(),
          quantity: Joi.number().integer().min(1).default(1),
          size: Joi.string().allow('', null).default('Standard'),
          colorway: Joi.string().allow('', null).default('Default'),
          image: Joi.string().allow('', null).default(''),
        })
      )
      .required()
      .messages({
        'array.min': 'Order must contain at least one item',
      }),
    shippingAddress: Joi.object({
      firstName: Joi.string().trim().allow('', null),
      lastName: Joi.string().trim().allow('', null),
      address: Joi.string().trim().allow('', null),
      apartment: Joi.string().trim().allow('', null),
      city: Joi.string().trim().allow('', null),
      state: Joi.string().trim().allow('', null),
      zipCode: Joi.string().trim().allow('', null),
      country: Joi.string().trim().default('US'),
    }).optional(),
    shippingMethod: Joi.string().valid('standard', 'priority').default('standard'),
    paymentMethod: Joi.string().default('credit-card'),
  }),
}

export const orderIdParamSchema = {
  params: Joi.object({
    id: Joi.string().trim().required().messages({
      'any.required': 'Order ID is required',
    }),
  }),
}
