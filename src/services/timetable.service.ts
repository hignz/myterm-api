import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import {
  timetableTable,
  type InsertTimetable,
  type SelectTimetable,
} from '../db/schema.js';

const getTimetableByCodeAndSemester = async (
  courseCode: SelectTimetable['courseCode'],
  semester: SelectTimetable['semester'],
) =>
  db.query.

const updateTimetable = async (
  id: SelectTimetable['id'],
  data: Partial<Omit<SelectTimetable, 'id'>>,
) => {
  await db.update(timetableTable).set(data).where(eq(timetableTable.id, id));
};

const createTimetable = async (data: InsertTimetable) =>
  await db.insert(timetableTable).values(data);

export { createTimetable, getTimetableByCodeAndSemester, updateTimetable };
