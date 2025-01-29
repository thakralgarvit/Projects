const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // these variables should be of these names only
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECERT,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "WanderLust_Dev",
    allowerdFormat: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage
};