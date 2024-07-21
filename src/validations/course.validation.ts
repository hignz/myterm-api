import Joi from 'joi';

const getCourses = Joi.object({
  college: Joi.number().min(0).max(2).default(0).required(),
});

export { getCourses };
