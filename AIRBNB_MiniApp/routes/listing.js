const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const path = require("path");

router.use(express.json());

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

//index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing });
  })
);

//new route
router.get("/new", (req, res) => {
  res.render("./listing/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("review");
    if (!listing) {
      req.flash("error", "listing does not exist");
      res.redirect("/listing");
    } else {
        res.render("./listing/show.ejs", { listing });
    }
  })
);

//creat route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Invalid listing data");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "new Listing Created");
    res.redirect("/listing");
  })
);

//edit route
router.get(
  "/:id/edit",
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
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send a vaild data");
    }
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
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listing");
  })
);

module.exports = router;
