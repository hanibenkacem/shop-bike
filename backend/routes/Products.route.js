const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/AuthMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createProduct,
  getProducts,
  getProductsByCategory,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/Product.controller");


// CREATE PRODUCT WITH IMAGES
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 }
  ]),
  createProduct
);

router.get("/", getProducts);

router.get("/category/:categoryId", getProductsByCategory);

router.get("/:id", getSingleProduct);

router.put("/:id", verifyToken,updateProduct);

router.delete("/:id",verifyToken,deleteProduct);

module.exports = router;