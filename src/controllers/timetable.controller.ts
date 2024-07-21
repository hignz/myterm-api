import { diff } from 'deep-object-diff';
import catchAsync from '../utils/catchAsync.js';
import config from '../config/config.js';
import * as timetableService from '../services/timetable.service.js';
import * as scraperService from '../services/scraper.service.js';
import logger from '../config/logger.js';

import type { Request, Response } from 'express';

const getTimetable = catchAsync(async (req: Request, res: Response) => {
  const courseCode = decodeURIComponent(req.query.code as string);
  const collegeIndex = req.query.college as string;
  const semesterIndex = req.query.sem as string;
  const timetable = await timetableService.getTimetableByCodeAndSemester(courseCode, semesterIndex);
  // If timetable is not in the db, scrape and return it
  if (!timetable) {
    const scrapedTimetable = await scraperService.scrapeTimetable(
      courseCode,
      collegeIndex,
      semesterIndex,
    );

    if (!scrapedTimetable) {
      return res.send({
        timedout: true,
      });
    }

    const newTimetable = await timetableService.createTimetable(scrapedTimetable);

    return res.send(newTimetable);
  }

  // If timetable in db is "old", rescrape and check for differences
  const outOfDate = timetable.updatedAt < Date.now() - config.RESCRAPE_THRESHOLD;
  if (outOfDate) {
    const scrapedTimetable = await scraperService.scrapeTimetable(
      courseCode,
      collegeIndex,
      semesterIndex,
    );

    if (!scrapedTimetable) {
      Object.assign(timetable, {
        timedout: true,
      });
      return res.send(timetable);
    }

    // if there is a difference in stored and freshly scraped timetables, update the db
    // @ts-expect-error FIX ME
    const difference = diff(scrapedTimetable.data, timetable.data);
    if (Object.keys(difference).length) {
      logger.info(`[difference found]`);

      const updatedTimetable = await timetableService.updateTimetable(
        timetable._id,
        scrapedTimetable,
      );
      return res.send(updatedTimetable);
    }
  }

  return res.send(timetable);
});

export { getTimetable };
