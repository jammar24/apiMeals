const express = require('express');

const {
  createRestaurant,
  findAllRestaurant,
  findOneRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createReviewRestaurant,
  updateReviewRestaurant,
  deleteReviewRestaurant,
} = require('../controllers/restaurants.controller');

const validExistMiddleware = require('../middlewares/restaurants.middleware');
const validReview = require('../middlewares/reviews.middleware');
const validationCreate = require('../middlewares/validations.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', findAllRestaurant);
router.get(
  '/:id',
  validExistMiddleware.validIfExistRestaurantPlusReview,
  findOneRestaurant
);

router.use(authMiddleware.protect);

router
  .route('/')
  .post(
    authMiddleware.restrictTo('admin'),
    validationCreate.createRestaurantValidation,
    createRestaurant
  );

router
  .route('/:id')
  .patch(
    validExistMiddleware.validIfExistRestaurant,
    authMiddleware.restrictTo('admin'),
    updateRestaurant
  )
  .delete(
    validExistMiddleware.validIfExistRestaurant,
    authMiddleware.restrictTo('admin'),
    deleteRestaurant
  );

router.post(
  '/reviews/:id',
  validationCreate.createReviewValidation,
  createReviewRestaurant
);
router.patch(
  '/review/:restaurantId/:id',
  validReview.validIfExistReview,
  updateReviewRestaurant
);
router.delete(
  '/review/:restaurantId/:id',
  validReview.validIfExistReview,
  deleteReviewRestaurant
);

module.exports = router;
