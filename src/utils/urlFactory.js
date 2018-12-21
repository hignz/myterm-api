const config = require('../config');

module.exports = urlPart => `${config.URL_START}${urlPart}${config.SEM2_URL_PART}`;
