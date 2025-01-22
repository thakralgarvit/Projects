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
const { listingSchema } = require("./schema.js");
const { log } = require("console");

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
  let error = listingSchema.validate(req.body);
  if(error) {
    throw new ExpressError(400, error.error);
  } else {
    next();
  }
}

//index Route
app.get("/listing", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./Listing/index.ejs", { allListing });
}));

//new route
app.get("/listing/new", (req, res) => {
  res.render("./listing/new.ejs");
});

//show route
app.get("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("./listing/show.ejs", { listing });
}));

//creat route
app.post("/listing", validateListing, wrapAsync(async (req, res) => {
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

//delete route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listing");
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
  next(new ExpressError(500, "page not found")); 
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
