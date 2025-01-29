const Listing = require("../models/listing.js");
const categoryIcons = require("../utils/categoryIcons.js");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing, categoryIcons });
};

module.exports.newList = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.showAll = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "review", populate: "author" })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing does not exist");
    res.redirect("/listing");
  }
  res.render("./listing/show.ejs", { listing });
};

module.exports.creatList = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing({
    title: req.body.listing.title,
    description: req.body.listing.description,
    price: req.body.listing.price,
    location: req.body.listing.location,
    country: req.body.listing.country,
    category: req.body.listing.category, // Explicitly include category
  });
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "new Listing Created");
  res.redirect("/listing");
};

module.exports.editlist = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  req.flash("success", "Listing Edited");
  if (!listing) {
    req.flash("error", "listing does not exist");
    res.redirect("/listing");
  } else {
    let oglistingImgUrl = listing.image.url;
    oglistingImgUrl = oglistingImgUrl.replace("/upload", "/upload/w_300")
    res.render("./listing/edit.ejs", { oglistingImgUrl });
  }
};

module.exports.updateList = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteList = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listing");
};
