const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const path = require("path");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");

router.use(express.json());



//index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing });
  })
);

//new route
router.get("/new", isloggedIn, (req, res) => {
  res.render("./listing/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({path: "review", populate: "author"})
      .populate("owner");
    if (!listing) {
      req.flash("error", "listing does not exist");
      res.redirect("/listing");
    }
    res.render("./listing/show.ejs", { listing });
  })
);

//creat route
router.post(
  "/",
  isloggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new Listing Created");
    res.redirect("/listing");
  })
);

//edit route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    req.flash("success", "Listing Edited");
    if (!listing) {
      req.flash("error", "listing does not exist");
      res.redirect("/listing");
    } else {
      res.render("./listing/edit.ejs", { listing });
    }
  })
);

//update route
router.put(
  "/:id",
  isloggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let url = req.body.listing.image;
    let img = {
      filename: "listingimage",
      url: url,
    };
    
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing, image: img },
      { new: true }
    );
    req.flash("success", "Listing updated");

    res.redirect(`/listing/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isloggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listing");
  })
);

module.exports = router;
