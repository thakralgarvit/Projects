const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg", // Default URL
      set: (v) =>
        v && v.trim() !== ""
          ? v
          : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
