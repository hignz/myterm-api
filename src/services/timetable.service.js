const httpStatus = require('http-status');
const { Timetable } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Gets the timetable by course code and semester
 * @param {String} id
 * @param {String} semester
 * @returns {Promise<Timetable>}
 */
const getTimetableByCodeAndSemester = async (courseCode, semester) =>
  Timetable.findOne({ courseCode, semester }).lean();

/**
 * Gets the timetable by its id
 * @param {String} id
 * @returns {Promise<Timetable>}
 */
const getTimetableById = async (id) => Timetable.findById(id);

/**
 * Updates timetable
 * @param {String} courseCode
 * @param {String} semester
 * @param {Object} scrapedTimetable
 * @returns {Promise<Timetable>}
 */
// const updateTimetable = async (courseCode, semester, scrapedTimetable) =>
//   Timetable.findOneAndUpdate({ courseCode, semester }, scrapedTimetable, { new: true });

/**
 * Updates timetable
 * @param {ObjectId} id
 * @param {Object} scrapedTimetable
 * @returns {Promise<Timetable>}
 */
const updateTimetable = async (id, data) => {
  const timetable = await getTimetableById(id);
  if (!timetable) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not find timetable to update');
  }

  Object.assign(timetable, data);
  await timetable.save();
  return timetable;
};

const createTimetable = async (data) => Timetable.create(data);

module.exports = {
  createTimetable,
  getTimetableById,
  getTimetableByCodeAndSemester,
  updateTimetable,
};
