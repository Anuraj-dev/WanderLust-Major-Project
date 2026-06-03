const cloudinaryModule = require("cloudinary");
const cloudinary = cloudinaryModule.v2;
const multerCloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// multer-storage-cloudinary@2.x internally calls cloudinary.v2.uploader,
// so it must receive the root module, not the .v2 instance.
const storage = multerCloudinaryStorage({
  cloudinary: cloudinaryModule,
  folder: "WanderLust_DEV",
  allowedFormats: ["png", "jpeg", "jpg"],
});

module.exports = {
  cloudinary,
  storage,
};
