import mongoose from 'mongoose';
import day from './day.model.js';

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
    data: [[day.schema]],
  },
  { timestamps: true }
);

const timetables = mongoose.model('Timetable', timetableSchema);

export default timetables;
