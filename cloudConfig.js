const cloudinaryLib = require("cloudinary");
const cloudinary = cloudinaryLib.v2;
const multerCloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multerCloudinaryStorage({
  cloudinary: cloudinaryLib,
  folder: "WanderLust_DEV",
  allowedFormats: ["png", "jpeg", "jpg"],
});

module.exports = {
  cloudinary,
  storage,
};
