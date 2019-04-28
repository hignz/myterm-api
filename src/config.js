module.exports = {
  PORT: process.env.PORT,
  LABROOM_URL: process.env.LAB_URL || 'https://www.itsligo.ie/student-hub/computer-labs/',
  LECTUREROOM_URL: process.env.LECTURE_URL || 'https://www.itsligo.ie/student-hub/lecture-rooms/',
  MONGODB_URI: process.env.MONGODB_URI,
  LIST_URL: '/reporting/textspreadsheet;student+set;id;',
  SEM1_URL_PART: '?t=student+set+textspreadsheet&days=1-7&weeks=3-9;11-16&periods=1-28&template=student+set+textspreadsheet',
  SEM2_URL_PART: '?t=student+set+textspreadsheet&days=1-7&weeks=22&periods=1-28&template=student+set+textspreadsheet',
  COLLEGE_URLS: [
    'http://timetables.itsligo.ie:81',
    'http://timetable.ait.ie',
    'http://timetable.lit.ie:8080',
  ],
  COLLEGE_TIMETABLE_URLS: [
    'http://timetables.itsligo.ie:81/studentset.htm',
    'http://timetable.ait.ie/students.htm',
    'http://timetable.lit.ie:8080/studentset.htm',
  ],
  COURSE_UPDATER_INTERVAL: 1 * 1440 * 60 * 1000,
};
