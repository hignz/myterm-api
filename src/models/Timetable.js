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
  _id: {
    type: mongoose.Types.ObjectId,
  },
  title: {
    type: String,
  },
  courseCode: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  semester: {
    type: String,
  },
  college: {
    type: String,
  },
  empty: {
    type: Boolean,
  },
  url: {
    type: String,
  },
  data: [[Day]],
});

module.exports = mongoose.model('Timetable', TimetableSchema);
