const Restaurant = require('../models/restaurants.model');
const Review = require('../models/reviews.model');

const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

exports.validIfExistRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!restaurant) {
    return next(new AppError(`Restaurant id: ${id} not found🏪`, 404));
  }
  req.restaurant = restaurant;
  next();
});

exports.validIfExistRestaurantPlusReview = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: {
        id,
        status: 'active',
      },
      include: [
        {
          model: Review,
        },
      ],
    });

    if (!restaurant) {
      return next(new AppError(`Restaurant id: ${id} not found🏯`, 404));
    }
    req.restaurant = restaurant;
    next();
  }
);
