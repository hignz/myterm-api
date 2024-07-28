import { zValidator } from '@hono/zod-validator';
import { diff } from 'deep-object-diff';
import { Hono } from 'hono';
import { z } from 'zod';

import config from '../../config/config.js';
import { scrapeTimetable } from '../../services/scraper.service.js';
import * as timetableService from '../../services/timetable.service.js';

const app = new Hono();

app.get(
  '/timetables',
  zValidator(
    'query',
    z.object({
      college: z.string(),
      code: z.string(),
      sem: z.string(),
    }),
  ),
  async (c) => {
    const courseCode = decodeURIComponent(c.req.valid('query').code);
    const collegeIndex = c.req.valid('query').college;
    const semesterIndex = c.req.valid('query').sem;

    const timetable = await timetableService.getTimetableByCodeAndSemester(
      courseCode,
      semesterIndex,
    );

    // If timetable is not in the db, scrape and return it
    if (!timetable) {
      const scrapedTimetable = await scrapeTimetable(
        courseCode,
        collegeIndex,
        semesterIndex,
      );

      if (!scrapedTimetable) {
        return c.json({
          timedout: true,
        });
      }

      const newTimetable =
        await timetableService.createTimetable(scrapedTimetable);

      return c.json(newTimetable);
    }

    // If timetable in db is "old", rescrape and check for differences
    const outOfDate =
      timetable.updatedAt.getTime() < Date.now() - config.RESCRAPE_THRESHOLD;
    if (outOfDate) {
      const scrapedTimetable = await scrapeTimetable(
        courseCode,
        collegeIndex,
        semesterIndex,
      );

      if (!scrapedTimetable) {
        Object.assign(timetable, {
          timedout: true,
        });

        return c.json(timetable);
      }

      // if there is a difference in stored and freshly scraped timetables, update the db
      // @ts-expect-error FIX ME
      const difference = diff(scrapedTimetable.data, timetable.data);
      if (Object.keys(difference).length) {
        // logger.info(`[difference found]`);

        const updatedTimetable = await timetableService.updateTimetable(
          timetable._id,
          scrapedTimetable,
        );
        return c.json(updatedTimetable);
      } else {
        // update timestamp
        // logger.info(`updating timestamp`);
        await timetableService.updateTimetable(timetable._id, {
          updatedAt: new Date(),
        });
      }
    }

    return c.json(timetable);
  },
);

export default app;
