const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const chalk = require('chalk');
const exphbs = require('express-handlebars');
const updater = require('./updater');

/**
 * Environment Variables
 */
dotenv.config();
const { PORT, MONGODB_URI } = process.env;

/**
 * Express App
 */
const app = express();

/**
 * Views
 */
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.get('/', (req, res) => {
  res.render('home');
});

/**
 * Middleware
 */
app.use(helmet());
app.use(morgan('dev'));
app.set('x-powered-by', 'IT Timetable Server');
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(cors());
app.use('/api', require('../routes/timetable'));
app.use('/api', require('../routes/courses'));
app.use('/api', require('../routes/rooms'));

/**
 * Error Handling
 */
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500).json({
    message: error,
  });
});

/**
 * MongoDB Connection
 */
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    app.listen(PORT, console.log(chalk.yellow(`✔︎ Server started on port ${PORT}`)));
  })
  .catch((err) => {
    console.log(err);
    console.log(chalk.red('Shutting down MyTerm Server'));
  });

/**
 * Database Connection Events
 */
const { connection } = mongoose;
connection.on('connected', () => {
  console.log(chalk.blue(`✔︎ Connected to Database: ${MONGODB_URI}`));
});
connection.on('error', (err) => {
  console.log(chalk.red(`✘ Database Error: ${err}`));
});
connection.on('disconnected', () => {
  console.log(chalk.red('✘ Disconnected from Database'));
});
connection.on('reconnected', () => {
  console.log(chalk.green(`✔︎ Reconnected to Database: ${MONGODB_URI}`));
});

(async () => {
  await updater();
})();
