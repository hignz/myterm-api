const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
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

courseSchema.index({ college: 1 });

const courses = mongoose.model('Course', courseSchema);

module.exports = courses;
