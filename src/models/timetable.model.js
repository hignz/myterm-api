const mongoose = require('mongoose');
const day = require('./day.model').schema;

const timetableSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    courseCode: {
      type: String,
      trim: true,
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
    data: [[day]],
  },
  { timestamps: true }
);

const timetables = mongoose.model('Timetable', timetableSchema);

module.exports = timetables;
