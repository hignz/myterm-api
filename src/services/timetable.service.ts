import { HTTPException } from 'hono/http-exception';
import type { Types } from 'mongoose';

import Timetable from '../models/timetable.model.js';

const getTimetableByCodeAndSemester = async (
  courseCode: string,
  semester: string,
) => Timetable.findOne({ courseCode, semester }).lean();

const getTimetableById = async (id: Types.ObjectId) => Timetable.findById(id);

const updateTimetable = async (id: Types.ObjectId, data: unknown) => {
  const timetable = await getTimetableById(id);
  if (!timetable) {
    throw new HTTPException(404, { message: 'Timetable not found' });
  }

  Object.assign(timetable, data);
  await timetable.save();
  return timetable;
};

const createTimetable = async (data: unknown) => Timetable.create(data);

export { createTimetable, getTimetableByCodeAndSemester, updateTimetable };
