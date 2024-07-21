import httpStatus from 'http-status';
import Timetable from '../models/timetable.model.js';
import ApiError from '../utils/ApiError.js';

const getTimetableByCodeAndSemester = async (courseCode: string, semester: string) =>
  Timetable.findOne({ courseCode, semester }).lean();

const getTimetableById = async (id: string) => Timetable.findById(id);

// const updateTimetable = async (courseCode, semester, scrapedTimetable) =>
//   Timetable.findOneAndUpdate({ courseCode, semester }, scrapedTimetable, { new: true });

const updateTimetable = async (id: string, data: unknown) => {
  const timetable = await getTimetableById(id);
  if (!timetable) {
    throw new ApiError(httpStatus.NO_CONTENT, 'Could not find timetable to update');
  }

  Object.assign(timetable, data);
  await timetable.save();
  return timetable;
};

const createTimetable = async (data: unknown) => Timetable.create(data);

export { createTimetable, getTimetableByCodeAndSemester, updateTimetable };
