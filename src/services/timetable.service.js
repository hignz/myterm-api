const { Timetable } = require('../models');

/**
 * Gets the timetable by its id
 * @param {String} id
 * @param {String} semester
 * @returns {Promise<Timetable>}
 */
const getTimetableById = async (id, semester) => Timetable.findOne({ courseCode: id, semester });

/**
 * Updates timetable
 * @param {String} courseCode
 * @param {String} semester
 * @param {Object} scrapedTimetable
 * @returns {Promise<Timetable>}
 */
const updateTimetable = async (courseCode, semester, scrapedTimetable) =>
  Timetable.findOneAndUpdate({ courseCode, semester }, scrapedTimetable, { new: true });

module.exports = {
  getTimetableById,
  updateTimetable,
};
