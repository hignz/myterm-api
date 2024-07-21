import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  LABROOM_URL: process.env.LAB_URL || 'https://www.itsligo.ie/student-hub/computer-labs/',
  LECTUREROOM_URL: process.env.LECTURE_URL || 'https://www.itsligo.ie/student-hub/lecture-rooms/',
  MONGODB_URI: process.env.MONGODB_URI,
  LIST_URL: '/reporting/textspreadsheet;student+set;id;',
  URL_PARTS: [
    '?t=student+set+textspreadsheet&days=1-7&weeks=3-15&periods=3-24&template=student+set+textspreadsheet',
    '?t=student+set+textspreadsheet&days=1-7&weeks=22-32;35-36&periods=1-28&template=student+set+textspreadsheet',
  ],
  COLLEGE_URLS: [
    {
      NAME: 'IT Sligo',
      COURSES_URL: 'http://timetables.itsligo.ie:81/studentset.htm',
      TIMETABLE_URL: 'http://timetables.itsligo.ie:81',
    },
    // {
    //   NAME: 'Athlone Institute of Technology',
    //   COURSES_URL: 'https://timetable.ait.ie/2021/default.aspx',
    //   TIMETABLE_URL: 'http://timetable.ait.ie',
    // },
    // {
    //   NAME: 'Limerick Institute of Technology',
    //   COURSES_URL: 'http://timetable.lit.ie:8080/studentset2.htm',
    //   TIMETABLE_URL: 'http://timetable.lit.ie:8080',
    // },
  ],
  RESCRAPE_THRESHOLD: 1000 * 1,
  // RESCRAPE_THRESHOLD: 1000 * 60 * 60 * 1,
  COURSE_UPDATE_INTERVAL: 1000 * 60 * 60 * 24,
};
