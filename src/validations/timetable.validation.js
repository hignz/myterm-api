const Joi = require('joi');

const getTimetable = Joi.object({
  code: Joi.string().max(50).required(),
  college: Joi.number().min(0).max(2).default(0).required(),
  sem: Joi.string(),
});

module.exports = {
  getTimetable,
};
