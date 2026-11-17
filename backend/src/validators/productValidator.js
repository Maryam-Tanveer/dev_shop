import Joi from 'joi'

export const productQuerySchema = {
  query: Joi.object({
    category: Joi.string().trim().allow('', null).optional(),
    brand: Joi.string().trim().allow('', null).optional(),
    brands: Joi.string().trim().allow('', null).optional(),
    minPrice: Joi.alternatives().try(Joi.number().min(0), Joi.string().trim().allow('', null)).optional(),
    maxPrice: Joi.alternatives().try(Joi.number().min(0), Joi.string().trim().allow('', null)).optional(),
    size: Joi.string().trim().allow('', null).optional(),
    sizes: Joi.string().trim().allow('', null).optional(),
    q: Joi.string().trim().allow('', null).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(200).default(100),
    sort: Joi.string().trim().allow('', null).optional(),
  }).unknown(true),
}

export const productIdParamSchema = {
  params: Joi.object({
    id: Joi.string().trim().required().messages({
      'any.required': 'Product ID is required in URL parameter',
    }),
  }),
}

export const createProductSchema = {
  body: Joi.object({
    id: Joi.string().trim().optional(),
    title: Joi.string().trim().required(),
    fullTitle: Joi.string().trim().allow('', null).optional(),
    brand: Joi.string().trim().required(),
    category: Joi.string().trim().default('Sneakers'),
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0).allow(null).optional(),
    stockStatus: Joi.string().valid('In Stock', 'Low Stock', 'Sold Out', 'TBA').default('In Stock'),
    stock: Joi.number().integer().min(0).default(15),
    badge: Joi.string().trim().allow('', null).optional(),
    badgeType: Joi.string().allow('', null).optional(),
    badgeColor: Joi.string().allow('', null).optional(),
    image: Joi.string().required(),
    description: Joi.string().trim().allow('', null).optional(),
    sizes: Joi.array().items(Joi.any()).optional(),
    colorways: Joi.array().items(Joi.any()).optional(),
  }),
}

export const updateProductSchema = {
  params: Joi.object({
    id: Joi.string().trim().required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().optional(),
    brand: Joi.string().trim().optional(),
    category: Joi.string().trim().optional(),
    price: Joi.number().min(0).optional(),
    originalPrice: Joi.number().min(0).allow(null).optional(),
    stockStatus: Joi.string().valid('In Stock', 'Low Stock', 'Sold Out', 'TBA').optional(),
    stock: Joi.number().integer().min(0).optional(),
    badge: Joi.string().trim().allow('', null).optional(),
    image: Joi.string().optional(),
    isUnavailable: Joi.boolean().optional(),
  }),
}
