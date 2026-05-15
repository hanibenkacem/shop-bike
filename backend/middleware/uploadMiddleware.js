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

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bike-shop/videos",
    resource_type: "video", // 🔥 REQUIRED
    allowed_formats: ["mp4", "mov", "avi", "webm"],
  },
});
const upload = multer({ storage });
const uploadVideo = multer({ storage: videoStorage });


module.exports = { upload, uploadVideo };