const Review = require('../models/reviews.model');

const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

exports.validIfExistReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;
  const { sessionUser } = req;
  const review = await Review.findOne({
    where: {
      id,
      restaurantId,
    },
  });

  if (review.userId !== sessionUser.id) {
    return next(
      new AppError(
        ' Sorry, but you do not have the necessary permissions to make changes to this review.🪪',
        401
      )
    );
  }
  req.review = review;
  next();
});
