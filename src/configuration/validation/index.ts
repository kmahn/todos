import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  LOG_LEVEL: Joi.string().valid('debug', 'info'),
  JWT_SECRET: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  ADMIN_NAME: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
});
