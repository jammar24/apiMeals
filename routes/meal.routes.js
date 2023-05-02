const express = require('express');

const {
  createMeals,
  findAllMeals,
  findOneMeals,
  updateMeals,
  deleteMeals,
} = require('../controllers/meals.controller');

const validMeals = require('../middlewares/meals.middleware');
const validationCreate = require('../middlewares/validations.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', findAllMeals);
router.get('/:id', validMeals.validIfExistMealPlusRestaurant, findOneMeals);

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router
  .route('/:id')
  .post(validationCreate.createMealValidation, createMeals)
  .patch(validMeals.validIfExistMeal, updateMeals)
  .delete(validMeals.validIfExistMeal, deleteMeals);

module.exports = router;
