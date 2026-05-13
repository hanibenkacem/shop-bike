const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "bike-shop",
      allowed_formats: ["jpg", "png", "jpeg", "webp"], // Use this instead of dynamic splitting
      transformation: [{ width: 1000, height: 1000, crop: "limit" }] // Optional: resizes huge images
    },
  });

const upload = multer({ storage });

module.exports = upload;