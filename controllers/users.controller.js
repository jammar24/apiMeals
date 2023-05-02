const User = require('../models/users.model');
const Order = require('../models/orders.model');
const Meals = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');

const catchAsync = require('../helpers/catchAsync');
const generateJWT = require('../helpers/jwt');
const bcrypt = require('bcryptjs');

exports.createUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt(11);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'The user account has been successfully created👤',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError('The user could not be found📍', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(
      new AppError('Invalid email or password. Please try again⚙️', 401)
    );
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const { user } = req;

  await user.update({
    name,
    email,
  });

  res.status(200).json({
    status: 'succes',
    message: 'The user information has been updated successfully.👤',
    user,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({
    status: 'disabled',
  });

  res.status(200).json({
    status: 'success',
    message: 'User deleted',
    user,
  });
});

exports.findAllOrdersByUser = catchAsync(async (req, res) => {
  const { sessionUser } = req;
  const orders = await Order.findAll({
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
    status: 'succes',
    results: orders.length,
    orders,
  });
});

exports.findOneOrderById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: {
      status: 'active',
      id,
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
    status: 'active',
    order,
  });
});
