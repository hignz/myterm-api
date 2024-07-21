import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { getCoursesByCollegeId } from '../services/course.service.js';

const getCoursesByCollege = catchAsync(async (req: Request, res: Response) => {
  const courses = await getCoursesByCollegeId(req.query.college as string);
  if (!courses || !courses.length) {
    throw new ApiError(httpStatus.NO_CONTENT, 'Courses not found');
  }
  res.send(courses);
});

export { getCoursesByCollege };
