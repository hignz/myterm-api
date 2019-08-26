const config = require('../config');
const getSemesterUrl = require('./getSemesterUrl');

module.exports = (urlPart, collegeIndex, sem) => `${config.COLLEGE_URLS[collegeIndex].TIMETABLE_URL}${config.LIST_URL}${encodeURIComponent(urlPart).replace(/_/g, '%5F')}${getSemesterUrl(sem)}`;
