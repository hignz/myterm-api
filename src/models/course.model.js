const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    select: false,
  },
  title: {
    type: String,
  },
  course: {
    type: String,
  },
  college: {
    type: String,
  },
});

const courses = mongoose.model('Course', courseSchema);

module.exports = courses;
