const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const httpStatus = require('http-status');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const xss = require('xss-clean');
const { CronJob } = require('cron');
const { errorConverter, errorHandler } = require('../middleware/error');
const ApiError = require('../utils/ApiError');
const { updateCourseCodes } = require('./updater');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(cors());

app.use('/v1', require('../routes/v1'));

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

/**
 * CronJob, updates courses everyday at 6:00am
 * 0 6 * * *
 * minute hour day(month) month d(week)
 */
const job = new CronJob('0 6 * * *', updateCourseCodes, null, true, 'Europe/Dublin');
job.start();

// updateCourseCodes();

module.exports = app;
