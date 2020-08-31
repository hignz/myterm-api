const Joi = require('joi');

const getCourses = Joi.object({
  college: Joi.number().min(0).max(2).default(0).required(),
});

module.exports = {
  getCourses,
};
