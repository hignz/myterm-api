const config = require('../config');
const semesterChecker = require('./semesterChecker');

module.exports = (urlPart, sem) => `${config.URL_START}${urlPart}${semesterChecker(sem)}`;
