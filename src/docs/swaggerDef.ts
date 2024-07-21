import config from '../config/config.js';
import { version } from '../../package.json';

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

export default swaggerDef;
