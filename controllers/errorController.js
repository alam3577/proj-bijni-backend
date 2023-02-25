const AppError = require('../utils/appError');

const ErrorDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const ErrorProduction = (res, err) => {
  // Operational Trusted Error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error Don't leak to the client
  } else {
    // 1. log the error
    console.error('Error', err);
    // 2. Send generic error
    res.status(500).json({
      status: 'error',
      message: 'Something gone very wrong!',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate Field Value: '${err.keyValue.name}' Please Use another Value`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const value = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  const message = `Invalid Input: ${value}`;
  return new AppError(message, 400);
};

const handleTokenError = () =>
  new AppError(`Invalid token. Please login again !`, 401);

const handleTokenExpireError = () =>
  new AppError(`Token Expired. Please login again !`, 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') ErrorDevelopment(err, res);

  if (process.env.NODE_ENV.trim() === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.name = err.name;

    // For Invalid Ids
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    // For duplicate fields(checking unique)
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    // For handling invalid inputs
    if (error.name === 'ValidationError')
      error = handleValidationErrorDb(error);
    if (error.name === 'JsonWebTokenError') error = handleTokenError(error);

    if (error.name === 'TokenExpiredError')
      error = handleTokenExpireError(error);
    ErrorProduction(res, error);
  }
};
