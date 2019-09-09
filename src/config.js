module.exports = {
  PORT: process.env.PORT,
  LABROOM_URL: process.env.LAB_URL || 'https://www.itsligo.ie/student-hub/computer-labs/',
  LECTUREROOM_URL: process.env.LECTURE_URL || 'https://www.itsligo.ie/student-hub/lecture-rooms/',
  MONGODB_URI: process.env.MONGODB_URI,
  LIST_URL: '/reporting/textspreadsheet;student+set;id;',
  SEM1_URL_PART: '?t=student+set+textspreadsheet&days=1-7&weeks=3&periods=3-28&template=student+set+textspreadsheet',
  SEM2_URL_PART: '?t=student+set+textspreadsheet&days=1-7&weeks=22-32;35-36&periods=1-28&template=student+set+textspreadsheet',
  COLLEGE_URLS: [
    {
      NAME: 'IT Sligo',
      COURSES_URL: 'http://timetables.itsligo.ie:81/studentset.htm',
      TIMETABLE_URL: 'http://timetables.itsligo.ie:81',
    },
    {
      NAME: 'Athlone Institute of Technology',
      COURSES_URL: 'http://timetable.ait.ie/students.htm',
      TIMETABLE_URL: 'http://timetable.ait.ie',
    },
    {
      NAME: 'Limerick Institute of Technology',
      COURSES_URL: 'http://timetable.lit.ie:8080/studentset2.htm',
      TIMETABLE_URL: 'http://timetable.lit.ie:8080',
    },
  ],
  RESCRAPE_THRESHOLD: 1000 * 60 * 10,
  COURSE_UPDATE_INTERVAL: 1000 * 60 * 60 * 24,
};
