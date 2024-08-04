import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { courseTable } from '../db/schema.js';

const getCoursesByCollegeId = async (id: string) =>
  db.select().from(courseTable).where(eq(courseTable.college, id));

export { getCoursesByCollegeId };
