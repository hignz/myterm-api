const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
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

const courses = mongoose.model('Courses', CourseSchema);

module.exports = courses;
