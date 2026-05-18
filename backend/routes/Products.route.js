const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/AuthMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  createProduct,
  getProducts,
  getProductsByCategory,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  // ── new ──
  addProductImages,
  deleteProductImage,
  addProductVideo,
  deleteProductVideo,
} = require("../controllers/Product.controller");


// ── existing routes ──────────────────────────────────────────
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video",  maxCount: 1  },
  ]),
  createProduct
);

router.get("/",                        getProducts);
router.get("/category/:categoryId",    getProductsByCategory);
router.get("/:id",                     getSingleProduct);
router.put("/:id",      verifyToken,   updateProduct);
router.delete("/:id",   verifyToken,   deleteProduct);

// ── image management ─────────────────────────────────────────
router.post(
  "/:id/images",
  verifyToken,
  upload.fields([{ name: "images", maxCount: 10 }]),
  addProductImages
);

router.delete(
  "/:id/images/:imgId",
  verifyToken,
  deleteProductImage
);

// ── video management ─────────────────────────────────────────
router.post(
  "/:id/video",
  verifyToken,
  upload.fields([{ name: "video", maxCount: 1 }]),
  addProductVideo
);

router.delete(
  "/:id/video",
  verifyToken,
  deleteProductVideo
);


module.exports = router;