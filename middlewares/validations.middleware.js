const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }
  next();
};

(exports.createUserValidation = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 9 })
    .withMessage('Password must be at least 9 characters long🌐'),
  validFields,
]),
  (exports.createMealValidation = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('price')
      .notEmpty()
      .withMessage('Price cannot be empty')
      .isNumeric()
      .withMessage('The price must be of type number'),
    validFields,
  ]);

exports.createRestaurantValidation = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('address').notEmpty().withMessage('Address cannot be empty'),
  body('rating')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isIn([1, 2, 3, 4, 5])
    .withMessage('The number must be between 1 and 5🌟'),
  validFields,
];

exports.createReviewValidation = [
  body('comment').notEmpty().withMessage('Name cannot be empty'),
  body('rating')
    .notEmpty()
    .withMessage('Rating cannot be empty')
    .isIn([1, 2, 3, 4, 5])
    .withMessage('The number must be between 1 and 5.🌟'),
  validFields,
];
