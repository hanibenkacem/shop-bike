import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AddProductModal from "../../components/admin/AddProductModal";
import EditProductModal from "../../components/admin/EditProductModal";
import Navbar from "../../components/Navbar";
import AddCategoryModal from "../../components/admin/AddCategoryModal";
import EditCategoryModal from "../../components/admin/EditCategoryModal";
/* ── CLEAN ADMIN STYLES ── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

  .adm-page {
    min-height: 100vh;
    background: #f5f5f5;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    padding: 30px 5%;
  }

  .adm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 40px;
  }

  .adm-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 4px 0;
  }

  .adm-header p {
    color: #666;
    margin: 0;
  }

  .adm-logout-btn {
    background: transparent;
    border: 1px solid #ddd;
    color: #444;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: 'Cairo', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
  }

  .adm-logout-btn:hover {
    border-color: #999;
    background: #fafafa;
  }

  .adm-add-btn {
    background: #1a1a1a;
    color: white;
    border: none;
    padding: 13px 24px;
    border-radius: 10px;
    font-family: 'Cairo', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 35px;
  }

  .adm-add-btn:hover {
    background: #333;
  }

  .adm-product-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .adm-product-card {
    background: white;
    border: 1px solid #eee;
    border-radius: 14px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    transition: box-shadow 0.2s;
    flex-wrap: wrap;
  }

  .adm-product-card:hover {
    box-shadow: 0 4px 14px rgba(0,0,0,0.04);
  }

  .adm-product-left {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 200px;
  }

  .adm-product-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 10px;
    background: #f0f0f0;
  }

  .adm-product-info h2 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 6px 0;
  }

  .adm-product-info p {
    color: #555;
    margin: 0;
    font-weight: 600;
  }

  .adm-product-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .adm-btn {
    padding: 9px 18px;
    border-radius: 8px;
    font-family: 'Cairo', sans-serif;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: 0.2s;
    font-size: 0.9rem;
  }

  .adm-btn-edit {
    background: orange;
    color: #333;
    border: 1px solid #ddd;
  }

  

  .adm-btn-delete {
    background: red;
    color: white;
    border: 1px solid #ffdddd;
  }

  .adm-btn-delete:hover {
    background: red;
    border-color: #ffaaaa;
  }

  @media (max-width: 600px) {
    .adm-page {
      padding: 20px 4%;
    }
    .adm-product-card {
      flex-direction: column;
      align-items: flex-start;
    }
    .adm-product-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openEditCategoryModal, setOpenEditCategoryModal] =
  useState(false);

const [selectedCategory, setSelectedCategory] =
  useState(null);

  const [openCategoryModal, setOpenCategoryModal] =
    useState(false);
  useEffect(() => {
    fetchProducts();
    fetchCategories();

  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCategories = async () => {

    try {
  
      const res = await API.get("/categories");
  
      setCategories(res.data);
  
    } catch (error) {
  
      console.error(error);
  
    }
  
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("هل تريد حذف المنتج ؟");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحذف");
    }
  };
  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm("هل تريد حذف الفئة ؟");
  
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
  
      await API.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchCategories();
    } catch (error) {
      console.error(error);
          const msg = error.response?.data?.message || "حدث خطأ أثناء حذف الفئة";
    alert(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <>
      <style>{css}</style>
      <Navbar />
      <div className="adm-page">
        {/* Header */}
        <div className="adm-header">
          <div>
            <h1>مرحباً {admin?.name || "Admin"}</h1>
            <p>لوحة تحكم World Bike</p>
          </div>
          <button className="adm-logout-btn" onClick={logout}>
            تسجيل الخروج
          </button>
        </div>

        {/* Add product button */}
        <button className="adm-add-btn" onClick={() => setOpenModal(true)}>
          + إضافة منتج جديد
        </button>
        <button
    className="adm-add-btn"
    onClick={() => setOpenCategoryModal(true)}
    style={{ 
      background: "#006233", // Algerian Green
      marginBottom: 0 
    }}
  >
    + إضافة فئة
  </button>

        {/* Product list */}
        <div className="adm-product-list">
          {products.map((product) => (
            <div key={product.id} className="adm-product-card">
              {/* Left side – image + info */}
              <div className="adm-product-left">
              <img
  src={product.images?.[0]?.image_url}
  alt={product.title}
  className="adm-product-img"
/>
                <div className="adm-product-info">
                  <h2>{product.title}</h2>
                  <p>{product.price} دج</p>
                </div>
              </div>

              {/* Right side – actions */}
              <div className="adm-product-actions">
                <button
                  className="adm-btn adm-btn-edit" 
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpenEditModal(true);
                  }}
                >
                  تعديل
                </button>
                <button
                  className="adm-btn adm-btn-delete"
                  onClick={() => deleteProduct(product.id)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
{/* Categories */}
<div style={{ marginTop: "60px" }}>
  <h2
    style={{
      marginBottom: "20px",
      fontSize: "1.6rem",
      fontWeight: "700",
      color: "#111",
    }}
  >
    الفئات
  </h2>

  <div className="adm-product-list">
    {categories.map((category) => (
      <div
        key={category.id}
        className="adm-product-card"
      >
       <div className="adm-product-left">
  <img
    src={category.image}
    alt={category.name}
    className="adm-product-img"
  />

  <div className="adm-product-info">
            <h2>{category.name}</h2>
          </div>
        </div>

        <div className="adm-product-actions">
          <button
            className="adm-btn adm-btn-edit"
            onClick={() => {
              setSelectedCategory(category);
              setOpenEditCategoryModal(true);
            }}
          >
            تعديل
          </button>

          <button
            className="adm-btn adm-btn-delete"
            onClick={() =>
              deleteCategory(category.id)
            }
          >
            حذف
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Modals */}
        <AddProductModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchProducts}
        />
        
        <EditProductModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          product={selectedProduct}
          onSuccess={fetchProducts}
        />
        <AddCategoryModal
  open={openCategoryModal}
  onClose={() => setOpenCategoryModal(false)}
  onSuccess={fetchCategories}
/>
<EditCategoryModal
  open={openEditCategoryModal}
  onClose={() => setOpenEditCategoryModal(false)}
  category={selectedCategory}
  onSuccess={fetchCategories}
/>
      </div>
    </>
  );
}