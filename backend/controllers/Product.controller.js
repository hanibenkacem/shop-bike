

// CREATE PRODUCT
const db = require("../db/db");
const cloudinary = require("../config/cloudinary");


// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const {
      category_id,
      title,
      slug,
      description,
      price,
      stock,
      brand,
      size,
      color,
      mainImageIndex // <--- This is sent from your React modal
    } = req.body;

    const generatedSlug = title.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
const videoUrl = req.files?.video?.[0]?.path || null;
console.log(req.files);
    // insert product
    const [result] = await db.query(
      `
    INSERT INTO products (
  category_id, title, slug, description, price, stock, brand, size, color, video_url
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [category_id, title, slug || generatedSlug, description, price, stock, brand, size, color, videoUrl]
    );

    const productId = result.insertId;

    // save images
    const images = req.files?.images || [];

if (images.length > 0) {
  for (let i = 0; i < images.length; i++) {
    const file = images[i];

    const isMain = i == mainImageIndex ? 1 : 0;

    await db.query(
      `
      INSERT INTO product_images (product_id, image_url, is_main)
      VALUES (?, ?, ?)
      `,
      [productId, file.path, isMain]
    );
  }
}

    res.status(201).json({
      message: "Product created successfully",
      productId
    });

  } catch (error) {
    console.error("🔥 Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Unknown error"
    });
  }
};
// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.*, 
        c.name AS category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);

    for (const product of products) {
      const [images] = await db.query(
        `SELECT id, image_url, is_main
         FROM product_images
         WHERE product_id = ?
         ORDER BY is_main DESC`,
        [product.id]
      );

      // We keep the objects so React can see the is_main property if needed
      product.images = images; 
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// GET PRODUCTS BY CATEGORY
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const [products] = await db.query(
      `
      SELECT * 
      FROM products 
      WHERE category_id = ? 
      ORDER BY id DESC
      `,
      [categoryId]
    );

    for (const product of products) {
      const [images] = await db.query(
        `
        SELECT image_url, is_main
        FROM product_images
        WHERE product_id = ?
        ORDER BY is_main DESC -- Main image first
        `,
        [product.id]
      );

      product.images = images;
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
    try {
  
      const { id } = req.params;
  
      const [products] = await db.query(
        `
        SELECT
          p.*,
          c.name AS category_name
        FROM products p
        JOIN categories c
        ON p.category_id = c.id
        WHERE p.id = ?
        `,
        [id]
      );
  
      if (products.length === 0) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
  
      const product = products[0];
  
      // get images
      const [images] = await db.query(
        `SELECT id, image_url, is_main
         FROM product_images
         WHERE product_id = ?
         ORDER BY is_main DESC`,
        [id]
      );
      
      product.images = images;
  
  
      res.json(product);
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: error.message
      });
  
    }
  };

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      category_id,
      title,
      slug,
      description,
      price,
      stock,
      brand,
      size,
      color
    } = req.body;
    const generatedSlug = title.toLowerCase().replace(/ /g, '-') + '-' + Date.now();

    await db.query(
      `
      UPDATE products
      SET
        category_id = ?,
        title = ?,
        slug = ?,
        description = ?,
        price = ?,
        stock = ?,
        brand = ?,
        size = ?,
        color = ?
      WHERE id = ?
      `,
      [
        category_id,
        title,
        generatedSlug,
        description,
        price,
        stock,
        brand,
        size,
        color,
        id
      ]
    );

    res.json({
      message: "Product updated"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    res.json({
      message: "Product deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


const getPublicId = (url) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : null;
};



exports.addProductImages = async (req, res) => {
  try {
    const { id } = req.params;
 
    // 1. Confirm the product exists
    const [rows] = await db.query(
      "SELECT id FROM products WHERE id = ?",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
 
    // 2. Multer + CloudinaryStorage already uploaded the files;
    //    req.files.images is an array of multer file objects
    const files = req.files?.images || [];
    if (!files.length) {
      return res.status(400).json({ message: "لم يتم إرسال أي صورة" });
    }
 
    // 3. Persist each Cloudinary URL in product_images
    for (const file of files) {
      await db.query(
        "INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)",
        [id, file.path, 0]   // is_main = 0; let the admin set the main image separately if needed
      );
    }
 
    res.status(201).json({ message: "تمت إضافة الصور بنجاح" });
 
  } catch (error) {
    console.error("addProductImages error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.deleteProductImage = async (req, res) => {
  try {
    const { id, imgId } = req.params;
 
    // 1. Fetch the image row so we have the Cloudinary URL
    const [rows] = await db.query(
      "SELECT * FROM product_images WHERE id = ? AND product_id = ?",
      [imgId, id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "الصورة غير موجودة" });
    }
 
    const imageUrl = rows[0].image_url;
 
    // 2. Delete from Cloudinary
    const publicId = getPublicId(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }
 
    // 3. Delete from DB
    await db.query(
      "DELETE FROM product_images WHERE id = ? AND product_id = ?",
      [imgId, id]
    );
 
    res.json({ message: "تم حذف الصورة" });
 
  } catch (error) {
    console.error("deleteProductImage error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.addProductVideo = async (req, res) => {
  try {
    const { id } = req.params;
 
    // 1. Confirm product exists and grab current video_url
    const [rows] = await db.query(
      "SELECT id, video_url FROM products WHERE id = ?",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
 
    // 2. Multer + CloudinaryStorage already uploaded the video
    const file = req.files?.video?.[0];
    if (!file) {
      return res.status(400).json({ message: "لم يتم إرسال أي فيديو" });
    }
 
    // 3. If there is an old video, remove it from Cloudinary
    const oldVideoUrl = rows[0].video_url;
    if (oldVideoUrl) {
      const oldPublicId = getPublicId(oldVideoUrl);
      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId, { resource_type: "video" });
      }
    }
 
    // 4. Save the new Cloudinary URL to the products table
    await db.query(
      "UPDATE products SET video_url = ? WHERE id = ?",
      [file.path, id]
    );
 
    res.json({ message: "تم رفع الفيديو بنجاح", video_url: file.path });
 
  } catch (error) {
    console.error("addProductVideo error:", error);
    res.status(500).json({ message: error.message });
  }
};
 
exports.deleteProductVideo = async (req, res) => {
  try {
    const { id } = req.params;
 
    // 1. Get current video_url
    const [rows] = await db.query(
      "SELECT video_url FROM products WHERE id = ?",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
 
    const videoUrl = rows[0].video_url;
    if (!videoUrl) {
      return res.status(400).json({ message: "لا يوجد فيديو لهذا المنتج" });
    }
 
    // 2. Delete from Cloudinary
    const publicId = getPublicId(videoUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    }
 
    // 3. Clear the column
    await db.query(
      "UPDATE products SET video_url = NULL WHERE id = ?",
      [id]
    );
 
    res.json({ message: "تم حذف الفيديو" });
 
  } catch (error) {
    console.error("deleteProductVideo error:", error);
    res.status(500).json({ message: error.message });
  }
};