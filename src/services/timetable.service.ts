import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import {
  timetableEvents,
  timetableTable,
  type InsertTimetable,
  type SelectTimetable,
} from '../db/schema.js';
import { aggregateOneToMany } from '../utils.js';

const getTimetableByCodeAndSemester = async (
  courseCode: SelectTimetable['courseCode'],
  semester: SelectTimetable['semester'],
) =>
  db
    .select()
    .from(timetableTable)
    .where(
      and(
        eq(timetableTable.courseCode, courseCode),
        eq(timetableTable.semester, semester),
      ),
    )
    .leftJoin(
      timetableEvents,
      eq(timetableTable.id, timetableEvents.timetableId),
    )
    .then(
      (rows) => aggregateOneToMany(rows, 'timetables', 'timetable_events')[0],
    );

const updateTimetable = async (
  id: SelectTimetable['id'],
  data: Partial<Omit<SelectTimetable, 'id'>>,
) => {
  await db.update(timetableTable).set(data).where(eq(timetableTable.id, id));
};

const createTimetable = async (data: InsertTimetable) =>
  await db.insert(timetableTable).values(data);

export { createTimetable, getTimetableByCodeAndSemester, updateTimetable };
