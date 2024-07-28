import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import mongoose from 'mongoose';
import courses from './routes/v1/courses.js';
import timetables from './routes/v1/timetables.js';
import { env } from './env.js';
import { CronJob } from 'cron';
import { updateCourseCodes } from './updater.js';

const app = new Hono();

app.use(logger());
app.use(cors());

app.route('/timetables', timetables);
app.route('/courses', courses);

mongoose.connect(env.DATABASE_URL).then(() => {
  // logger.info('MongoDB connection established');
  serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`Server is running on port ${env.PORT}`);
});

/**
 * CronJob, updates courses everyday at 6:00am
 * 0 6 * * *
 * minute hour day(month) month d(week)
 */
const job = new CronJob('0 6 * * *', updateCourseCodes, null, true, 'Europe/Dublin');
job.start();
