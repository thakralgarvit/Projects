const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoUrl = "mongodb://127.0.0.1:27017/wonderLust";
exports.mongoUrl = mongoUrl;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/rewiew.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("err while connecting to DB");
  });
async function main() {
  await mongoose.connect(mongoUrl);
}

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if(error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
}

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if(error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
}

//index Route
app.get("/listing", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listing/index.ejs", { allListing });
}));

//new route
app.get("/listing/new", (req, res) => {
  res.render("./listing/new.ejs");
});

//show route
app.get("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate("review");
  res.render("./listing/show.ejs", { listing });
}));

//creat route
app.post("/listing", validateListing, wrapAsync(async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Invalid listing data");
  }  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listing");
}));

//edit route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("./listing/edit.ejs", { listing });
}));

//update route
app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
  if(!req.body.listing) {
    throw new ExpressError(400, "send a vaild data")
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
}));
//   let { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   if (typeof req.file !== "undefined") {     //try this part 
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//   }
//   req.flash("success", "Listing Updated!");
//   res.redirect(`/listings/${id}`);

// PUT Route - Update Listing
// app.put("/listings/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).send("Invalid ID format.");
//     }

//     const updatedListing = await Listing.findByIdAndUpdate(
//       id,
//       { ...req.body.listing },
//       { new: true, runValidators: true }
//     );

//     if (!updatedListing) {
//       return res.status(404).send("Listing not found.");
//     }

//     res.redirect(`/listings/${id}`);
//   } catch (err) {
//     console.error("Error updating listing:", err);
//     res.status(500).send("An error occurred while updating the listing.");
//   }
// });

//delete route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listing");
}));

//review post route
app.post("/listing/:id/review", validateReview, wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listing/${listing._id}`);
}));

//delete review route
app.delete("/listing/:id/review/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listing/${id}`);
}));

// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "villa in bombay",
//         description: "a very big villa",
//         price: 20000,
//         location: "bombay",
//         country: "india",
//     });

//     await sampleListing.save();
//     console.log("same saved");
//     res.send("test completed");
// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found")); 
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("./listing/error.ejs", { err });
});

app.get("/", (req, res) => {
  res.send("i am Groot");
});

app.listen(8080, () => {
  console.log("server is listening 8080");
});
