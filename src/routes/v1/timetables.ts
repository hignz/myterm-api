import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { db } from '../../db/index.js';
import {
  timetableEvents,
  timetableTable,
  type InsertTimetableEvent,
} from '../../db/schema.js';
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
      const timetable = await timetableService.getTimetableByCodeAndSemester(
        code,
        sem,
      );

      // If timetable is not in the db, scrape and return it
      if (!timetable) {
        console.log('>>>> timetable not found, scraping');
        const scrapedTimetable = await handleMissingTimetable(
          code,
          college,
          sem,
        );
        return c.json(scrapedTimetable);
      }

      console.log('>>>> found timetable and returning it');
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
  console.log('scraped', scrapedTimetable?.title);
  if (!scrapedTimetable) {
    throw new HTTPException(401, { message: 'Could not scrape timetable' });
  }

  return await db.transaction(async (tx) => {
    console.log('>>>> inserting timetable');

    const newTimetable = await tx
      .insert(timetableTable)
      .values({
        college: scrapedTimetable.college,
        courseCode: scrapedTimetable.courseCode,
        semester: scrapedTimetable.semester,
        title: scrapedTimetable.title,
        empty: scrapedTimetable.empty,
        url: scrapedTimetable.url,
      })
      .returning()
      .get();

    if (!newTimetable) {
      throw new Error('Could not create timetable');
    }

    // Prepare all event inserts
    const eventInserts = scrapedTimetable.data?.flatMap((dayData, dayIndex) =>
      dayData?.map(
        (item) =>
          ({
            timetableId: newTimetable.id,
            dayOfWeek: dayIndex,
            activity: item?.activity,
            startTime: item?.startTime,
            endTime: item?.endTime,
            name: item?.name,
            room: item?.room,
            type: item?.type,
            teacher: item?.teacher,
          }) as InsertTimetableEvent,
      ),
    );

    if (!eventInserts) {
      throw new Error('Could not create events');
    }

    console.log('>>>> inserting events');
    // Insert all events at once
    await tx.insert(timetableEvents).values(eventInserts);

    return newTimetable;
  });
}

export default app;
