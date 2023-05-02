const AppError = require('../helpers/appError');

const handleCastError22P02 = () =>
  new AppError('Some type of data send does not match was expected', 400);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please login again', 401);

const handleJWTError = () =>
  new AppError('Invalid token! Please login again', 401);

const handleEmailError = () =>
  new AppError('Email is already in use, change it please!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('error, err');
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = err;

    if (error.parent?.code === '22P02') error = handleCastError22P02();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.parent?.code === '23505') error = handleEmailError();

    sendErrorProd(error, res);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

module.exports = globalErrorHandler;
