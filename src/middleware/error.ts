import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import config from '../config/config.js';
import logger from '../config/logger.js';

import type { Request, Response, NextFunction } from 'express';

const errorConverter = (
  err: ApiError | Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    // @ts-expect-error FIX ME
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    // @ts-expect-error FIX ME
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err: ApiError, req: Request, res: Response) => {
  let { statusCode, message } = err;
  if (config.ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.ENV === 'development' && { stack: err.stack }),
  };

  if (config.ENV === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
