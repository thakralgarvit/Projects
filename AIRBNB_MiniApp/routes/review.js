const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn, validateReview, isAuthor } = require("../middleware.js");

const contReview = require("../controllers/reviews.js");

router.use(express.json());

//review post route
router.post("/", isloggedIn, validateReview, wrapAsync(contReview.postReview));

//delete review route
router.delete("/:reviewId", isloggedIn, isAuthor, wrapAsync(contReview.deleteReview));

module.exports = router;