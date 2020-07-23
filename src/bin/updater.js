const { scrapeCourses } = require('../services/scraper.service');
const config = require('../config/config');
const { Course } = require('../models');
const logger = require('../config/logger');

async function getCourseCodes() {
  try {
    const collegeCourses = (
      await Promise.all(config.COLLEGE_URLS.map((url, index) => scrapeCourses(index)))
    ).reduce((courses, results) => courses.concat(results), []);

    await Course.deleteMany({});
    await Course.insertMany(collegeCourses);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = async () => {
  setTimeout(async function updateCoursesLoop() {
    try {
      await getCourseCodes();
      setTimeout(updateCoursesLoop, config.COURSE_UPDATE_INTERVAL);
    } catch (error) {
      logger.error(error);
    }
  }, 0);
};
