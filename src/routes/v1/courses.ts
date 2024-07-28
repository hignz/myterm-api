import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { getCoursesByCollegeId } from '../../services/course.service.js';

const app = new Hono();

app.get(
  '/courses',
  zValidator(
    'query',
    z.object({
      college: z.string(),
    }),
  ),
  async (c) => {
    const courses = await getCoursesByCollegeId(c.req.valid('query').college);
    if (!courses || !courses.length) {
      // throw new ApiError(httpStatus.NO_CONTENT, 'Courses not found');
    }
    c.json(courses);
  },
);

export default app;
