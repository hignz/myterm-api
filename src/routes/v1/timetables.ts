import { zValidator } from '@hono/zod-validator';
import { diff } from 'deep-object-diff';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import config from '../../config/config.js';
import type { InsertTimetable } from '../../db/schema.js';
import { scrapeTimetable } from '../../services/scraper.service.js';
import * as timetableService from '../../services/timetable.service.js';

const app = new Hono();

app.get(
  '/',
  zValidator(
    'query',
    z.object({
      college: z.string(),
      code: z.string(),
      sem: z.coerce.number().min(0).max(1),
    }),
  ),
  async (c) => {
    const { code, college, sem } = c.req.valid('query');

    try {
      let timetable = await timetableService.getTimetableByCodeAndSemester(
        code,
        sem,
      );

      // If timetable is not in the db, scrape and return it
      if (!timetable) {
        // @ts-expect-error FIX ME
        timetable = await handleMissingTimetable(code, college, sem);
      } else {
        timetable = await handleExistingTimetable(
          timetable,
          code,
          college,
          sem,
        );
      }

      return c.json(timetable);
    } catch (error) {
      if (error instanceof HTTPException) {
        return c.json({ error: error.message }, error.status);
      }
      return c.json({ error: 'Internal server error' }, 500);
    }
  },
);

async function handleMissingTimetable(
  courseCode: string,
  collegeIndex: string,
  semesterIndex: number,
) {
  const scrapedTimetable = await scrapeTimetable(
    courseCode,
    collegeIndex,
    semesterIndex,
  );
  if (!scrapedTimetable) {
    throw new HTTPException(401, { message: 'Could not scrape timetable' });
  }
  return await timetableService.createTimetable(scrapedTimetable);
}

async function handleExistingTimetable(
  timetable: InsertTimetable,
  courseCode: string,
  collegeIndex: string,
  semesterIndex: number,
) {
  const outOfDate =
    new Date(timetable.updatedAt ?? new Date()).getTime() <
    Date.now() - config.RESCRAPE_THRESHOLD;

  if (!outOfDate) return timetable;

  const scrapedTimetable = await scrapeTimetable(
    courseCode,
    collegeIndex,
    semesterIndex,
  );

  if (!scrapedTimetable?.data) {
    return { ...timetable, timedout: true };
  }

  const difference = diff(scrapedTimetable.data, timetable.data);
  if (Object.keys(difference).length) {
    return await timetableService.updateTimetable(timetable._id, {
      ...scrapedTimetable,
    });
  } else {
    await timetableService.updateTimetable(timetable._id, {
      updatedAt: new Date().toString(),
    });
    return timetable;
  }
}

export default app;
