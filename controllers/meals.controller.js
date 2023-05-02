const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');
const catchAsync = require('../helpers/catchAsync');

exports.createMeals = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const meal = await Meal.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({
    status: 'success',
    meal,
  });
});

exports.findAllMeals = catchAsync(async (req, res) => {
  const meals = await Meal.findAll({
    status: 'active',

    include: [
      {
        model: Restaurant,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: meals.length,
    meals,
  });
});

exports.findOneMeals = catchAsync(async (req, res) => {
  const { meal } = req;

  res.status(200).json({
    status: 'success',
    meal,
  });
});

exports.updateMeals = catchAsync(async (req, res) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({
    name,
    price,
  });

  res.status(200).json({
    statu: 'success',
    message: 'The meal information has been updated successfully.🍷🍝',
    meal,
  });
});

exports.deleteMeals = catchAsync(async (req, res) => {
  const { meal } = req;
  await meal.update({
    status: 'disabled',
  });

  res.status(200).json({
    status: 'success',
    message:
      'sorry, but this meal option is currently unavailable or has been disabled.🍻',
  });
});
