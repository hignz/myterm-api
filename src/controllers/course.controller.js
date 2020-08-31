const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { courseService } = require('../services');

const getCoursesByCollege = catchAsync(async (req, res) => {
  const courses = await courseService.getCoursesByCollegeId(req.query.college);
  if (!courses || !courses.length) {
    throw new ApiError(httpStatus.NO_CONTENT, 'Courses not found');
  }
  res.send(courses);
});

module.exports = {
  getCoursesByCollege,
};
