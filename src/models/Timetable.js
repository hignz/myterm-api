const mongoose = require('mongoose');

const Day = new mongoose.Schema({
  day: String,
  startTime: String,
  name: String,
  room: String,
  type: String,
  teacher: String,
  length: String,
  endTime: String,
}, { _id: false });

const TimetableSchema = new mongoose.Schema({
  course: {
    type: String,
  },
  data: [[Day]],
  date: {
    type: Date,
    default: Date.now,
  },
  empty: {
    type: Boolean,
  },
  courseCode: {
    type: String,
  },
  url: {
    type: String,
  },
  semester: {
    type: String,
  },
});

module.exports = mongoose.model('Timetable', TimetableSchema);
