import Joi from 'joi';

const getTimetable = Joi.object({
  code: Joi.string().max(75).required(),
  college: Joi.number().min(0).max(2).default(0).required(),
  sem: Joi.number().min(0).max(1),
});

export { getTimetable };
