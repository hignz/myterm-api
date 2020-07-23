const mongoose = require('mongoose');

const daySchema = mongoose.Schema(
  {
    day: {
      type: String,
    },
    startTime: {
      type: String,
    },
    name: {
      type: String,
    },
    room: {
      type: String,
    },
    type: {
      type: String,
    },
    teacher: {
      type: String,
    },
    length: {
      type: String,
    },
    endTime: {
      type: String,
    },
    break: {
      type: Boolean,
    },
    breakLength: {
      type: String,
    },
  },
  { _id: false }
);

const days = mongoose.model('Day', daySchema);

module.exports = days;
