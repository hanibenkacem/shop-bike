

// CREATE PRODUCT
const db = require("../db/db");


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

    // insert product
    const [result] = await db.query(
      `
      INSERT INTO products (
        category_id, title, slug, description, price, stock, brand, size, color
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [category_id, title, slug || generatedSlug, description, price, stock, brand, size, color]
    );

    const productId = result.insertId;

    // save images
    if (req.files && req.files.length > 0) {
      // Use a standard for loop to get the index (i)
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        // Check if the current file index matches the mainImageIndex from React
        // Note: we use == because mainImageIndex might be a string "0"
        const isMain = i == mainImageIndex ? 1 : 0;

        await db.query(
          `
          INSERT INTO product_images (
            product_id,
            image_url,
            is_main
          )
          VALUES (?, ?, ?)
          `,
          [
            productId,
            file.path, // or file.filename depending on your Multer storage config
            isMain
          ]
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
        `
        SELECT image_url, is_main
        FROM product_images
        WHERE product_id = ?
        ORDER BY is_main DESC -- This puts the "1" (main) at the top (index 0)
        `,
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
        `
        SELECT image_url, is_main
        FROM product_images
        WHERE product_id = ?
        ORDER BY is_main DESC
        `,
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
        slug,
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