// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const morgan = require('morgan');

const productRoute = require('./routes/productRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const PORT = process.env.PORT || 8080;
const app = express();

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('uncaught Exception Shutting down ');
  process.exit(1);
});

// middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
app.use(express.json());

// own middleware
app.use('/api/v1/proj-bijni', productRoute);

// handling unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

// global error handler
app.use(globalErrorHandler);

// connections to database
require('./config/index');

// somewhere in our code promise get rejected so, handle this type of error I used this(eg. connection with db),
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection Shutting down');
  server.close(() => {
    process.exit(1);
  });
});

// assign server
app.listen(PORT, () => {
  console.log('server is running to the port of ', PORT);
});
