const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  course: {
    type: String,
  },
  url: {
    type: String,
  },
}, { collection: 'data' });

module.exports = mongoose.model('Timetable', TimetableSchema);
