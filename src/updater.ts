import config from './config/config.js';
import { db } from './db/index.js';
import { courseTable } from './db/schema.js';
import { scrapeCourses } from './services/scraper.service.js';

async function updateCourseCodes() {
  try {
    const collegeCourses = (
      await Promise.all(
        config.COLLEGE_URLS.map((_url, index) => scrapeCourses(index)),
      )
    ).reduce((courses, results) => courses.concat(results), []);

    if (!collegeCourses || !collegeCourses.length) {
      // logger.error('No courses found');
      return;
    }

    await db.delete(courseTable);

    await db.insert(courseTable).values(
      collegeCourses.map((course) => ({
        course: decodeURIComponent(course.course),
        title: course.title,
        college: course.college.toString(),
      })),
    );

    // await Course.deleteMany({});
    // await Course.insertMany(collegeCourses);
    // logger.info('Updated course codes');
  } catch {
    // logger.error(error);
  }
}

export { updateCourseCodes };
