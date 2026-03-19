const Joi = require('joi');

const schemas = {
  textToSpeech: Joi.object({
    text: Joi.string().min(1).max(5000).required(),
    voiceId: Joi.string().optional(),
    options: Joi.object({
      model_id: Joi.string().optional(),
      stability: Joi.number().min(0).max(1).optional(),
      similarity_boost: Joi.number().min(0).max(1).optional(),
      style: Joi.number().min(0).max(1).optional(),
      use_speaker_boost: Joi.boolean().optional(),
    }).optional(),
  }),

  createVideo: Joi.object({
    text: Joi.string().min(1).max(10000).required(),
    avatar_id: Joi.string().optional(),
    voice_id: Joi.string().optional(),
    title: Joi.string().max(200).optional(),
    width: Joi.number().min(256).max(3840).optional(),
    height: Joi.number().min(256).max(2160).optional(),
    aspect_ratio: Joi.string()
      .valid('16:9', '9:16', '1:1', '4:3', '3:4')
      .optional(),
    background_type: Joi.string().valid('color', 'image', 'video').optional(),
    background_value: Joi.string().optional(),
    scale: Joi.number().min(0.1).max(2).optional(),
  }),

  completeVideo: Joi.object({
    text: Joi.string().min(1).max(10000).required(),
    titleText: Joi.string().max(200).optional(),
    titleColor: Joi.string()
      .pattern(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
    voiceId: Joi.string().optional(),
    useElevenLabs: Joi.boolean().optional(),
    useHeyGen: Joi.boolean().optional(),
    heygenOptions: Joi.object().optional(),
  }),

  environment: Joi.object({
    ELEVENLABS_API_KEY: Joi.string().required(),
    HEYGEN_API_KEY: Joi.string().required(),
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    LOG_LEVEL: Joi.string()
      .valid('error', 'warn', 'info', 'debug')
      .default('info'),
  }),
};

const validate = (data, schemaName) => {
  const schema = schemas[schemaName];
  if (!schema) {
    throw new Error(`Schema '${schemaName}' not found`);
  }

  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    throw new ValidationError('Validation failed', errors);
  }

  return value;
};

module.exports = {
  schemas,
  validate,
};