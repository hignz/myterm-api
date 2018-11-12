module.exports = {
  PORT: process.env.PORT,
  LABROOM_URL: process.env.LAB_URL || 'https://www.itsligo.ie/student-hub/computer-labs/',
  LECTUREROOM_URL: process.env.LECTURE_URL || 'https://www.itsligo.ie/student-hub/lecture-rooms/',
  MONGODB_URI: process.env.MONGODB_URI,
};
