const Listing = require("../models/listing.js");
const Review = require("../models/rewiew.js");

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "new Review Created");
    res.redirect(`/listing/${listing._id}`);
  };

  module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review Deleted");
    res.redirect(`/listing/${id}`);
  };