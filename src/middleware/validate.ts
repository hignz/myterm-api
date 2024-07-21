import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

import type { Request, Response, NextFunction } from 'express';
import type { Schema } from 'joi';

const middleware = (schema: Schema, property: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property as keyof Request]);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    return next();
  };
};

export default middleware;
