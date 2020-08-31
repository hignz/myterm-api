const { scrapeCourses } = require('../services/scraper.service');
const config = require('../config/config');
const { Course } = require('../models');
const logger = require('../config/logger');

async function updateCourseCodes() {
  try {
    const collegeCourses = (
      await Promise.all(config.COLLEGE_URLS.map((url, index) => scrapeCourses(index)))
    ).reduce((courses, results) => courses.concat(results), []);

    if (!collegeCourses || !collegeCourses.length) {
      logger.error('No courses found');
      return;
    }
    await Course.deleteMany({});
    await Course.insertMany(collegeCourses);
    logger.info('Updated course codes');
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  updateCourseCodes,
};
