const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');

const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

exports.validIfExistMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
  });
  if (!meal) {
    return next(new AppError('Meal not found🍽️', 404));
  }
  req.meal = meal;
  next();
});

exports.validIfExistMealPlusRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: Restaurant,
      },
    ],
  });
  if (!meal) {
    return next(new AppError('Meal not found🍽️', 404));
  }
  req.meal = meal;
  next();
});
