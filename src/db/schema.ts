import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const courseTable = sqliteTable('course', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  course: text('course').notNull(),
  college: text('college').notNull(),
});

export const dayTable = sqliteTable('day', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  activity: text('activity').notNull(),
  day: text('day').notNull(),
  startTime: text('startTime').notNull(),
  name: text('name').notNull(),
  room: text('room').notNull(),
  type: text('type').notNull(),
  teacher: text('teacher').notNull(),
  length: text('length').notNull(),
  endTime: text('endTime').notNull(),
  break: integer('break', { mode: 'boolean' }).notNull(),
  breakLength: integer('breakLength').notNull(),
  timetableId: integer('timetableId')
    .notNull()
    .references(() => timetableTable.id),
  createdAt: text('createdAt')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull(),
  updatedAt: text('updatedAt')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const timetableTable = sqliteTable('timetable', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  courseCode: text('courseCode').notNull(),
  semester: integer('semester').notNull(),
  college: text('college').notNull(),
  empty: integer('empty', { mode: 'boolean' }).notNull(),
  url: text('url').notNull(),
  createdAt: text('createdAt')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull(),
  updatedAt: text('updatedAt')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull()
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export type InsertCourse = typeof courseTable.$inferInsert;
export type SelectCourse = typeof courseTable.$inferSelect;

export type InsertTimetable = typeof timetableTable.$inferInsert;
export type SelectTimetable = typeof timetableTable.$inferSelect;
