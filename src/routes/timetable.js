/* eslint-disable consistent-return */
const express = require('express');
const timetableScraper = require('../utils/timetableScraper');
const Timetable = require('../models/Timetable');
const config = require('../config');
const getSemester = require('../utils/getSemester');

const router = express.Router();

router.get('/timetable/:code?:college?:sem?', async (req, res, next) => {
  const courseCode = decodeURIComponent(req.query.code);
  const collegeIndex = req.query.college || '0';
  const semesterIndex = getSemester(req.query.sem);

  try {
    const timetable = await Timetable
      .findOne({ courseCode, semester: semesterIndex });

    /*
      If its not in the db, scrape it
    */
    if (!timetable) {
      const newTimetable = new Timetable(
        await timetableScraper(courseCode, collegeIndex, semesterIndex),
      );

      const result = await newTimetable.save();

      return res.status(200).json(result);
    }

    /*
      If stored timetable is out of date, rescrape
    */
    const outOfDate = timetable.date < (Date.now() - config.RESCRAPE_THRESHOLD);
    if (outOfDate) {
      const newTimetable = await timetableScraper(courseCode, collegeIndex, semesterIndex);
      newTimetable.date = Date.now();

      const updatedTimetable = await Timetable
        .findOneAndUpdate({ courseCode, semester: semesterIndex },
          newTimetable, { new: true });

      return res.status(200).json(updatedTimetable);
    }

    return res.status(200).json(timetable);
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
});

module.exports = router;
