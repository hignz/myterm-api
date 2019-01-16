const config = require('../config');
const semesterChecker = require('./semesterChecker');

<<<<<<< HEAD
module.exports = (urlPart, sem) => `${config.URL_START}${urlPart}${semesterChecker(sem)}`;
=======
module.exports = urlPart => `${config.URL_START}${urlPart}${config.SEM2_URL_PART}`;
>>>>>>> 5f097b57033348642ca31a6d2c22c3d05d5b2c7a
