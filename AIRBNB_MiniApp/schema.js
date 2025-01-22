//joi is a most popular validater
const Joi = require("joi");

module.exports.listingSchema = Joi.object({  // acording to the joi the schema should be an object
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required() // and also inside a object there should be another object that should be required
})
