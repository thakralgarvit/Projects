//joi is a most popular validater
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  // acording to the joi the schema should be an object
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    category: Joi.string().valid(
      "trending",
      "rooms",
      "iconic",
      "mountains",
      "castle",
      "pool",
      "bedBreakfast",
      "omg",
      "beach",
      "camping"
    ).required(),
  }).required(), // and also inside a object there should be another object that should be required
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
