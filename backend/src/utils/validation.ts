import Joi from 'joi';

export const authSchemas = {
  register: Joi.object({
    fullname: Joi.string().required().min(3).max(255),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(255),
    role: Joi.string().valid('admin', 'waste_manager', 'hospital_admin', 'collection_personnel'),
    hospital_id: Joi.number().optional(),
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  
  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),
  
  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().required().min(6),
  }),
};

export const binSchemas = {
  create: Joi.object({
    bin_code: Joi.string().required().max(50),
    location: Joi.string().required().max(255),
    hospital_id: Joi.number().required(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
  }),
  
  update: Joi.object({
    location: Joi.string().optional().max(255),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
  }),
  
  updateStatus: Joi.object({
    bin_code: Joi.string().required(),
    capacity_percentage: Joi.number().required().min(0).max(100),
    status: Joi.string().valid('available', 'nearly_full', 'full').required(),
  }),
};

export function validateSchema(schema: Joi.Schema, data: any): { value: any; error?: Joi.ValidationError } {
  return schema.validate(data, { abortEarly: false });
}
