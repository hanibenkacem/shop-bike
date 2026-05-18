const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {

    const isVideo = file.mimetype.startsWith("video");

    return {
      folder: isVideo
        ? "bike-shop/videos"
        : "bike-shop",

      resource_type: "auto",

      allowed_formats: isVideo
        ? ["mp4", "mov", "avi", "webm"]
        : ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const upload = multer({ storage });

module.exports = { upload };