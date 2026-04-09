import Joi from 'joi'

export const CreateCollaborationSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000).optional().allow('', null),
  brand_a_id: Joi.number().integer().positive().required(),
  brand_b_id: Joi.number().integer().positive().required(),
  category: Joi.string().max(50).optional().allow('', null),
  image_url: Joi.string().uri().optional().allow('', null),
  release_date: Joi.date().iso().optional().allow(null),
  source_url: Joi.string().uri().optional().allow('', null),
  status: Joi.string().valid('draft', 'pending', 'published').optional(),
  submitted_by: Joi.string().uuid().optional().allow(null),
})

export const UpdateCollaborationSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(2000).optional().allow('', null),
  brand_a_id: Joi.number().integer().positive().optional(),
  brand_b_id: Joi.number().integer().positive().optional(),
  category: Joi.string().max(50).optional().allow('', null),
  image_url: Joi.string().uri().optional().allow('', null),
  release_date: Joi.date().iso().optional().allow(null),
  source_url: Joi.string().uri().optional().allow('', null),
  status: Joi.string().valid('draft', 'pending', 'published').optional(),
}).min(1)

export const CreateBrandSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  category: Joi.string().max(50).optional().allow('', null),
  logo_url: Joi.string().uri().optional().allow('', null),
  website: Joi.string().uri().optional().allow('', null),
})
