import { scrapeCourses } from './services/scraper.service.js';
import config from './config/config.js';
import Course from './models/course.model.js';

async function updateCourseCodes() {
  try {
    const collegeCourses = (
      await Promise.all(config.COLLEGE_URLS.map((url, index) => scrapeCourses(index)))
    ).reduce((courses, results) => courses.concat(results), []);

    if (!collegeCourses || !collegeCourses.length) {
      // logger.error('No courses found');
      return;
    }

    await Course.deleteMany({});
    await Course.insertMany(collegeCourses);
    // logger.info('Updated course codes');
  } catch {
    // logger.error(error);
  }
}

export { updateCourseCodes };
