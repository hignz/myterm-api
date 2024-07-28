import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { getCoursesByCollegeId } from '../../services/course.service.js';

const app = new Hono();

app.get(
  '/',
  zValidator(
    'query',
    z.object({
      college: z.string(),
    }),
  ),
  async (c) => {
    const courses = await getCoursesByCollegeId(c.req.valid('query').college);
    if (!courses?.length) {
      throw new HTTPException(404, { message: 'Courses not found' });
    }
    c.json(courses);
  },
);

export default app;
