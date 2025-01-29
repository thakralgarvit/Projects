const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const contList = require("../controllers/listings.js");

router.use(express.json());

//index Route
router
  .route("/")
  .get(wrapAsync(contList.index)) //allListings
  .post(
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(contList.creatList)
  ); //createRoute

//new route
router.get("/new", isloggedIn, contList.newList); // it should be above otherwise it will take it as an id

router
  .route("/:id")
  .get(wrapAsync(contList.showAll)) //showRoute
  .put(
    isloggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(contList.updateList)
  ) //updateRoute
  .delete(isloggedIn, isOwner, wrapAsync(contList.deleteList)); //deleteRoute

//edit route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(contList.editlist));

module.exports = router;
