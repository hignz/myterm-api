const config = require('../config');
const semesterChecker = require('./semesterChecker');

module.exports = (urlPart, collegeIndex, sem) => `${config.COLLEGE_URLS[collegeIndex]}${config.LIST_URL}${urlPart}${semesterChecker(sem)}`;
