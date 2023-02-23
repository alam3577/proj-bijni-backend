// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const productRoute = require('./routes/productRoutes');
// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorControllers');

const DB = process.env.DATABASE;

const PORT = process.env.PORT || 8080;
const app = express();
// middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
app.use(express.json());
// require('./config');

// own middleware
// app.use('/api/v1/proj-bijni', productRoute);

// handling unhandled routes
// app.all('*', (req, res, next) => {
//   next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
// });

// global error handler
// app.use(globalErrorHandler);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('ERROR', err));

// assign server
app.listen(PORT, () => {
  console.log('server is running to the port of ', PORT);
});
console.log({ DB });
