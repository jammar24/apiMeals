const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const AppError = require('./helpers/appError');
const globalErrorHandler = require('./controllers/error.controller');

const routesUsers = require('./routes/user.routes');
const routesRestaurants = require('./routes/restaurant.routes');
const routesMeals = require('./routes/meal.routes');
const routesOrders = require('./routes/order.routes');

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in one hour!',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(express.json());
app.use(xss());
app.use(hpp());

app.use('/api/v1', limiter);

app.use('/api/v1/users', routesUsers);
app.use('/api/v1/restaurants', routesRestaurants);
app.use('/api/v1/meals', routesMeals);
app.use('/api/v1/orders', routesOrders);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`cannot find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
