const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/rewiew.js");
const path = require("path");
const { isloggedIn, validateReview, isAuthor } = require("../middleware.js");

router.use(express.json());

//review post route
router.post(
  "/",
  isloggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new Review Created");
    res.redirect(`/listing/${listing._id}`);
  })
);

//delete review route
router.delete(
  "/:reviewId",
  isloggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review Deleted");
    res.redirect(`/listing/${id}`);
  })
);

module.exports = router;