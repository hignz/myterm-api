const courseScraper = require('../utils/courseScraper');
const config = require('../config');
const Course = require('../models/Course');

async function getCourseCodes () {
  const collegeCourses = (await Promise.all(
    config.COLLEGE_URLS.map((x, index) => courseScraper(index)),
  )).reduce((courses, results) => courses.concat(results), []);

  await Course.deleteMany({});
  Course.insertMany(collegeCourses).then((res) => {
    console.log(res);
  }).catch(err => console.log(err));
}

module.exports = async () => {
  setTimeout(async function testLoop () {
    try {
      await getCourseCodes();
      setTimeout(testLoop, 1000);
    } catch (error) {
      console.log(error);
    }
  }, 0);
};
