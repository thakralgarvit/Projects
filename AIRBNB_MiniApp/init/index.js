const mongoose = require("mongoose");
const mongoUrl = "mongodb://127.0.0.1:27017/wonderLust";
const Listing = require("../models/listing.js");
const initData = require("./data.js");

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

const initdb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67935095d7ae228fabb25716",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initdb();
