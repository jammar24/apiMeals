const express = require('express');

const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  findAllOrdersByUser,
  findOneOrderById,
} = require('../controllers/users.controller');

const userMiddleware = require('../middlewares/users.middleware');
const Validations = require('../middlewares/validations.middleware');
const validOrders = require('../middlewares/orders.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', Validations.createUserValidation, createUser);
router.post('/login', loginUser);

router.use(authMiddleware.protect);

router.get('/orders', findAllOrdersByUser);
router.get('/orders/:id', validOrders.validIfExistOrder, findOneOrderById);

router
  .route('/:id')
  .patch(
    userMiddleware.validIfExistUser,
    authMiddleware.protectAccountOwner,
    updateUser
  )
  .delete(
    userMiddleware.validIfExistUser,
    authMiddleware.protectAccountOwner,
    deleteUser
  );

module.exports = router;
