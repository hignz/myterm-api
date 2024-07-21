import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import config from '../config/config.js';
import logger from '../config/logger.js';

let server: http.Server;
mongoose.connect(config.MONGODB_URI as string).then(() => {
  logger.info('MongoDB connection established');
  server = app.listen(config.PORT, () => {
    logger.info(`Listening to port ${config.PORT}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close(async () => {
      await mongoose.connection.close(false);

      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  }
});
