const compression = require('compression');
const cors = require('cors');
const exphbs = require('express-handlebars');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.get('/', (req, res) => {
  res.render('home');
});

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use(compression());

app.use('/v1', require('../routes/v1'));

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

module.exports = app;
