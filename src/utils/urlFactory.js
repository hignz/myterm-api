const config = require('../config');

module.exports = urlPart => `${config.URL_START}${urlPart}${config.SEM1_URL_PART}`;
