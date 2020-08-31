const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const middleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    return next();
  };
};

module.exports = middleware;
