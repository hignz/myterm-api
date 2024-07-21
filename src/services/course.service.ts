import Course from '../models/course.model.js';

const getCoursesByCollegeId = async (id: string) => Course.find({ college: id }).lean();

export { getCoursesByCollegeId };
