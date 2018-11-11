module.exports = {
  PORT: process.env.PORT,
  LabRoomURL: process.env.LAB_URL || 'https://www.itsligo.ie/student-hub/computer-labs/',
  LectureRoomURL: process.env.LECTURE_URL || 'https://www.itsligo.ie/student-hub/lecture-rooms/',
  MONGODB_URI: process.env.MONGODB_URI,
};
