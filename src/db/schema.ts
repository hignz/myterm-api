import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const courseTable = sqliteTable('course', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  course: text('course').notNull(),
  college: text('college').notNull(),
});

export const timetableTable = sqliteTable('timetables', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  courseCode: text('course_code').notNull(),
  semester: integer('semester').notNull(),
  college: text('college').notNull(),
  empty: integer('empty', { mode: 'boolean' }).notNull(),
  url: text('url'),
  createdAt: text('created_at')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const timetableEvents = sqliteTable('timetable_events', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  timetableId: integer('timetable_id')
    .notNull()
    .references(() => timetableTable.id),
  dayOfWeek: integer('day_of_week').notNull(), // 0 for Monday, 6 for Sunday
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  activity: text('activity').notNull(),
  name: text('name').notNull(),
  room: text('room'),
  type: text('type'),
  teacher: text('teacher'),
  createdAt: text('created_at')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export type InsertCourse = typeof courseTable.$inferInsert;
export type SelectCourse = typeof courseTable.$inferSelect;

export type InsertTimetable = typeof timetableTable.$inferInsert;
export type SelectTimetable = typeof timetableTable.$inferSelect;

export type InsertTimetableEvent = typeof timetableEvents.$inferInsert;
export type SelectTimetableEvent = typeof timetableEvents.$inferSelect;
