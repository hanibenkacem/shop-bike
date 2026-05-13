const db = require("../db/db");

// GET categories
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    res.json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// CREATE category
exports.createCategory = async (req, res) => {
    try {
  
      const { name,slug } = req.body;
  
      // generate slug automatically
      
  
      // image from cloudinary
      const image = req.file
        ? req.file.path
        : null;
  
      await db.query(
        `
        INSERT INTO categories (
          name,
          slug,
          image
        )
        VALUES (?, ?, ?)
        `,
        [
          name,
          slug,
          image
        ]
      );
  
      res.status(201).json({
        message: "Category created"
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "Server error"
      });
  
    }
  };

// ✅ updateCategory — converted to async/await
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    await db.query(
      `UPDATE categories SET name = ?, image = ? WHERE id = ?`,
      [name, image, id]
    );
    res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ deleteCategory — converted to async/await
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `SELECT COUNT(*) AS total FROM products WHERE category_id = ?`,
      [id]
    );

    const total = result[0].total;

    if (total > 0) {
      return res.status(400).json({
        message: "لا يمكن حذف الفئة لأنها تحتوي على منتجات",
      });
    }

    await db.query(`DELETE FROM categories WHERE id = ?`, [id]);

    res.json({ message: "تم حذف الفئة بنجاح" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};