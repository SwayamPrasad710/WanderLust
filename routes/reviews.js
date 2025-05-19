const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/reviews.js");

const reviewsControllers = require("../controllers/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares.js");

//! Reviews post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsControllers.postReview)
);

//! Reviews Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsControllers.destroyReview)
);

module.exports = router;
