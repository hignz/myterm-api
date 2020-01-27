const courseScraper = require('../utils/courseScraper');
const config = require('../config');
const Course = require('../models/Course');

async function getCourseCodes () {
  try {
    const collegeCourses = (await Promise.all(
      config.COLLEGE_URLS.map((url, index) => courseScraper(index)),
    )).reduce((courses, results) => courses.concat(results), []);

    await Course.deleteMany({});
    await Course.insertMany(collegeCourses);
  } catch (error) {
    console.error(error);
  }
}

module.exports = async () => {
  setTimeout(async function updateCoursesLoop () {
    try {
      await getCourseCodes();
      setTimeout(updateCoursesLoop, config.COURSE_UPDATE_INTERVAL);
    } catch (error) {
      console.log(error);
    }
  }, 0);
};
