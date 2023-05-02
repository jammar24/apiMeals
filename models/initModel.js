const User = require('./users.model');
const Restaurant = require('./restaurants.model');
const Meal = require('./meals.model');
const Order = require('./orders.model');
const Review = require('./reviews.model');

const initModel = () => {
  User.hasMany(Review);
  Review.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Meal.hasOne(Order);
  Order.belongsTo(Meal);
};

module.exports = initModel;
