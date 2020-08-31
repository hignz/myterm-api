const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'MyTerm API',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hignz/myterm-api',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/v1`,
    },
  ],
};

module.exports = swaggerDef;
