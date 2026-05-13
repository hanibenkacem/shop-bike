const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/AuthMiddleware");
const upload = require("../middleware/uploadMiddleware")
const {
  getCategories,
  createCategory,updateCategory,deleteCategory
} = require("../controllers/Category.controller");

router.get("/", getCategories);
router.post("/",verifyToken,upload.single("image"), createCategory);
router.put(
  "/:id",verifyToken,
  updateCategory
);

router.delete(
  "/:id",verifyToken,
  deleteCategory
);
module.exports = router;