import mongoose from 'mongoose';

const daySchema = new mongoose.Schema(
  {
    activity: {
      type: String,
      trim: true,
    },
    day: {
      type: String,
    },
    startTime: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
    },
    teacher: {
      type: String,
      trim: true,
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
      type: Number,
    },
  },
  { _id: false }
);

const days = mongoose.model('Day', daySchema);

export default days;
