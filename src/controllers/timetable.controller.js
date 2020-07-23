const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { timetableService, scraperService } = require('../services');
const config = require('../config/config');

const getTimetable = catchAsync(async (req, res) => {
  const courseCode = decodeURIComponent(req.query.code);
  const collegeIndex = req.query.college || '0';
  const semesterIndex = await scraperService.getSemester(req.query.sem);
  const timetable = await timetableService.getTimetableById(courseCode, semesterIndex);

  /*
    If its not in the db, scrape it
  */
  if (!timetable) {
    const scrapedTimetable = await scraperService.scrapeTimetable(
      courseCode,
      collegeIndex,
      semesterIndex
    );

    return res.send(scrapedTimetable);
  }

  /*
    If stored timetable is out of date, rescrape
  */
  const outOfDate = timetable.updatedAt < Date.now() - config.RESCRAPE_THRESHOLD;
  if (outOfDate) {
    const scrapedTimetable = await scraperService.scrapeTimetable(
      courseCode,
      collegeIndex,
      semesterIndex
    );

    const updatedTimetable = await timetableService.updateTimetable(
      courseCode,
      semesterIndex,
      scrapedTimetable
    );

    return res.send(updatedTimetable);
  }

  return res.send(timetable);
});

module.exports = {
  getTimetable,
};
