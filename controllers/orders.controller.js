const Order = require('../models/orders.model');
const Meals = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');

const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { sessionUser } = req;

  const meal = await Meals.findOne({
    where: {
      id: mealId,
      status: 'active',
    },
  });

  if (!meal) {
    return next(new AppError('The meal not exist🍽️', 404));
  }

  const totalPriceOrder = quantity * meal.price;

  const order = await Order.create({
    quantity,
    mealId,
    userId: sessionUser.id,
    totalPrice: totalPriceOrder,
  });

  res.status(201).json({
    status: 'success',
    message: 'Order created🥂🍲',
    order,
  });
});

exports.findAllOrderUser = catchAsync(async (req, res) => {
  const { sessionUser } = req;

  const order = await Order.findAll({
    where: {
      status: 'active',
      userId: sessionUser.id,
    },
    include: [
      {
        model: Meals,
        include: [
          {
            model: Restaurant,
          },
        ],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: order.length,
    order,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(200).json({
    status: 'success',
    message: 'The order has been updated🍻🍖',
  });
});

exports.deleteOrder = catchAsync(async (req, res) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'success',
    message: 'The order has been deleted🍹🥠',
  });
});
