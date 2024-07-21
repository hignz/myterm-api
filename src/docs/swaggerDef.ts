import config from '../config/config.js';
import packageJson from '../../package.json' assert { type: 'json' };

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'MyTerm API',
    version: packageJson.version,
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

export default swaggerDef;
