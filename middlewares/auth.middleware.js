const User = require('../models/users.model');

const { promisify } = require('util');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const jwt = require('jsonwebtoken');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'Access to this feature requires you to be logged in. Please log in to proceed.🔑',
        401
      )
    );
  }
  console.log(token);

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError(
        'Sorry, but the owner of this token is no longer available, and this token is no longer valid for use.⚙️',
        401
      )
    );
  }

  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError('Your password has been recently changed.🔧', 401)
      );
    }
  }

  req.sessionUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('you do not own this account🔑', 401));
  }

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perform this action🪪', 403)
      );
    }

    next();
  };
};
