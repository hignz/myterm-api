const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  course: {
    type: String,
  },
  url: {
    type: String,
  },
  id: {
    type: Number,
  },
}, { collection: 'data' });


const Timetable = mongoose.model('Timetable', TimetableSchema);

module.exports = Timetable;
