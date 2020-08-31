const { diff } = require('deep-object-diff');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { timetableService, scraperService } = require('../services');
const logger = require('../config/logger');

const getTimetable = catchAsync(async (req, res) => {
  const courseCode = decodeURIComponent(req.query.code);
  const collegeIndex = req.query.college;
  const semesterIndex = req.query.sem;
  const timetable = await timetableService.getTimetableByCodeAndSemester(courseCode, semesterIndex);

  // If timetable is not in the db, scrape and return it
  if (!timetable) {
    const scrapedTimetable = await scraperService.scrapeTimetable(
      courseCode,
      collegeIndex,
      semesterIndex
    );

    const newTimetable = await timetableService.createTimetable(scrapedTimetable);

    return res.send(newTimetable);
  }

  // If timetable in db is "old", rescrape and check for differences
  const outOfDate = timetable.updatedAt < Date.now() - config.RESCRAPE_THRESHOLD;
  if (outOfDate) {
    const scrapedTimetable = await scraperService.scrapeTimetable(
      courseCode,
      collegeIndex,
      semesterIndex
    );
    // timetable.data.push({});
    // if there is a difference in stored and freshly scraped timetables, update the db
    const difference = diff(scrapedTimetable.data, timetable.data);
    if (Object.keys(difference).length) {
      logger.info(`[difference found]: ${difference}`);

      const updatedTimetable = await timetableService.updateTimetable(
        timetable._id,
        scrapedTimetable
      );
      return res.send(updatedTimetable);
    }
  }

  return res.send(timetable);
});

module.exports = {
  getTimetable,
};
