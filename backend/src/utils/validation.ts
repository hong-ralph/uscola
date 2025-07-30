import Joi from 'joi';

export const CreateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required()
});

export const UpdateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional()
}).min(1); // At least one field must be provided