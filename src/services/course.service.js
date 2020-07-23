const { Course } = require('../models');

/**
 * Gets courses by college id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getCoursesByCollegeId = async (id) => Course.find({ college: id });

module.exports = {
  getCoursesByCollegeId,
};
