import mongoose from 'mongoose';
import app from './app.js';
import config from '../config/config.js';
import logger from '../config/logger.js';

// @ts-expect-error FIX ME
let server;
mongoose
  .connect(config.MONGODB_URI as string, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('MongoDB connection established');
    server = app.listen(config.PORT, () => {
      logger.info(`Listening to port ${config.PORT}`);
    });
  });

const exitHandler = () => {
  // @ts-expect-error test
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
// @ts-expect-error test
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  // @ts-expect-error test
  if (server) {
    server.close(() => {
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });
  }
});
