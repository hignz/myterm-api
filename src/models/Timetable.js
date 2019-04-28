const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  course: {
    type: String,
  },
  url: {
    type: String,
  },
}, { collection: 'data' });

const AthloneSchema = new mongoose.Schema({
  course: {
    type: String,
  },
  url: {
    type: String,
  },
}, { collection: 'ait' });

const LimerickSchema = new mongoose.Schema({
  course: {
    type: String,
  },
  url: {
    type: String,
  },
}, { collection: 'lit' });

// module.exports = mongoose.model('Timetable', TimetableSchema);
module.exports = mongoose.model('lit', LimerickSchema);
