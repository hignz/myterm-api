import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { CronJob } from 'cron';
import { errorConverter, errorHandler } from '../middleware/error.js';
import ApiError from '../utils/ApiError.js';
import { updateCourseCodes } from './updater.js';
import courseRoute from '../routes/v1/course.route.js';
import docsRoute from '../routes/v1/docs.route.js';
import timetableRoute from '../routes/v1/timetable.route.js';
import type e from 'express';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(mongoSanitize());
app.use(compression());
app.use(cors());

app.use('/v1/courses', courseRoute);
app.use('/v1/docs', docsRoute);
app.use('/v1/timetables', timetableRoute);

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
});

app.use(({ next }: { next: e.NextFunction }) => {
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

export default app;
