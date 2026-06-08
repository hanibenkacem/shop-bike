import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AddProductModal from "../../components/admin/AddProductModal";
import EditProductModal from "../../components/admin/EditProductModal";
import Navbar from "../../components/Navbar";
import AddCategoryModal from "../../components/admin/AddCategoryModal";
import EditCategoryModal from "../../components/admin/EditCategoryModal";

/* ── STYLES ── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

  .adm-page {
    min-height: 100vh;
    background: #f5f5f5;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    padding: 30px 5%;
  }

  /* ── Header ── */
  .adm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 40px;
  }
  .adm-header h1 { font-size: 2rem; font-weight: 700; color: #111; margin: 0 0 4px 0; }
  .adm-header p  { color: #666; margin: 0; }

  /* ── Buttons ── */
  .adm-btn-base {
    font-family: 'Cairo', sans-serif;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
  }
  .adm-btn-dark   { background: #1a1a1a; color: #fff; padding: 11px 20px; font-size: 0.95rem; }
  .adm-btn-dark:hover { background: #333; }
  .adm-btn-outline { background: transparent; border: 1px solid #ddd; color: #444; padding: 10px 20px; }
  .adm-btn-outline:hover { border-color: #999; background: #fafafa; }
  .adm-btn-edit   { background: #fff7ed; color: #c2670a; border: 1px solid #fbd5a6; padding: 8px 16px; font-size: 0.88rem; }
  .adm-btn-edit:hover { background: #ffeedd; }
  .adm-btn-delete { background: #fff1f1; color: #cc2222; border: 1px solid #ffc5c5; padding: 8px 16px; font-size: 0.88rem; }
  .adm-btn-delete:hover { background: #ffe0e0; }

  /* ── Back link ── */
  .adm-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    font-family: 'Cairo', sans-serif;
    font-size: 0.95rem;
    color: #555;
    cursor: pointer;
    margin-bottom: 24px;
    padding: 0;
  }
  .adm-back:hover { color: #111; }

  /* ── Category grid ── */
  .adm-cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 18px;
  }
  .adm-cat-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 24px 16px 20px;
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .adm-cat-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    border-color: #ccc;
  }
  .adm-cat-img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 12px;
    background: #f0f0f0;
  }
  .adm-cat-name  { font-size: 1rem; font-weight: 700; color: #111; margin: 0; }
  .adm-cat-count { font-size: 0.85rem; color: #888; margin: 0; }

  /* ── Category detail header ── */
  .adm-detail-header {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 14px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 30px;
  }
  .adm-detail-header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .adm-detail-img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 12px;
    background: #f0f0f0;
  }
  .adm-detail-title { font-size: 1.3rem; font-weight: 700; color: #111; margin: 0 0 4px 0; }
  .adm-detail-subtitle { font-size: 0.9rem; color: #666; margin: 0; }

  /* ── Section row ── */
  .adm-section-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  .adm-section-title { font-size: 1.2rem; font-weight: 700; color: #111; margin: 0; }

  /* ── Product list ── */
  .adm-product-list { display: flex; flex-direction: column; gap: 14px; }
  .adm-product-card {
    background: white;
    border: 1px solid #eee;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    transition: box-shadow 0.2s;
  }
  .adm-product-card:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.04); }
  .adm-product-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 180px;
  }
  .adm-product-img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 10px;
    background: #f0f0f0;
    flex-shrink: 0;
  }
  .adm-product-info h2 { font-size: 1.05rem; font-weight: 700; color: #111; margin: 0 0 4px 0; }
  .adm-product-info p  { color: #555; margin: 0; font-weight: 600; font-size: 0.9rem; }

  .adm-product-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  /* ── Checkbox ── */
  .adm-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #cc2222;
    flex-shrink: 0;
  }

  /* ── Bulk delete bar ── */
  .adm-bulk-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff1f1;
    border: 1px solid #ffc5c5;
    border-radius: 10px;
    padding: 12px 20px;
    margin-bottom: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }
  .adm-bulk-bar span { font-weight: 600; color: #cc2222; font-size: 0.95rem; }
  .adm-btn-select-all {
    background: transparent;
    border: 1px solid #ccc;
    color: #444;
    padding: 7px 14px;
    font-size: 0.85rem;
  }
  .adm-btn-select-all:hover { border-color: #999; }

  /* ── Empty state ── */
  .adm-empty {
    text-align: center;
    padding: 40px 20px;
    color: #aaa;
    font-size: 0.95rem;
    background: #fff;
    border-radius: 14px;
    border: 1px dashed #ddd;
  }

  @media (max-width: 600px) {
    .adm-page { padding: 20px 4%; }
    .adm-product-card { flex-direction: column; align-items: flex-start; }
    .adm-product-actions { width: 100%; justify-content: flex-end; }
    .adm-detail-header { flex-direction: column; align-items: flex-start; }
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  /* ── Data ── */
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);

  /* ── Navigation: null = grid view, object = detail view ── */
  const [activeCategory, setActiveCategory] = useState(null);

  /* ── Modals ── */
  const [openAddProduct, setOpenAddProduct]   = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openAddCategory, setOpenAddCategory]   = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);


  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* ── Fetch ── */
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Helpers ── */
  const getToken = () => localStorage.getItem("token");

  const productsInCategory = (categoryId) =>
    products.filter((p) => p.category_id === categoryId);

  /* ── Delete ── */
  const deleteProduct = async (id) => {
    if (!window.confirm("هل تريد حذف المنتج ؟")) return;
    try {
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("هل تريد حذف الفئة ؟")) return;
    try {
      await API.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setActiveCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "حدث خطأ أثناء حذف الفئة";
      alert(msg);
    }
  };

  /* ── Logout ── */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  /* ─────────────────────────────────────────────
     RENDER: Category grid (default view)
  ───────────────────────────────────────────── */
  const renderGrid = () => (
    <>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
        <button
          className="adm-btn-base adm-btn-dark"
          onClick={() => setOpenAddProduct(true)}
        >
          + إضافة منتج
        </button>
        <button
          className="adm-btn-base adm-btn-dark"
          style={{ background: "#006233" }}
          onClick={() => setOpenAddCategory(true)}
        >
          + إضافة فئة
        </button>
      </div>

      <div className="adm-cat-grid">
        {categories.map((cat) => {
          const count = productsInCategory(cat.id).length;
          return (
            <div
              key={cat.id}
              className="adm-cat-card"
              onClick={() => setActiveCategory(cat)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="adm-cat-img"
              />
              <p className="adm-cat-name">{cat.name}</p>
              <p className="adm-cat-count">{count} منتج</p>
            </div>
          );
        })}
      </div>
    </>
  );

  /* ─────────────────────────────────────────────
     RENDER: Category detail view
  ───────────────────────────────────────────── */
  const renderDetail = () => {
    const cat = activeCategory;
    const catProducts = productsInCategory(cat.id);
    const allSelected = catProducts.length > 0 && catProducts.every(p => selectedIds.includes(p.id));
  
    const toggleSelect = (id) =>
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
  
    const toggleSelectAll = () =>
      setSelectedIds(allSelected ? [] : catProducts.map(p => p.id));
  
    const deleteSelected = async () => {
      if (!window.confirm(`هل تريد حذف ${selectedIds.length} منتج ؟`)) return;
      try {
        await Promise.all(
          selectedIds.map(id =>
            API.delete(`/products/${id}`, {
              headers: { Authorization: `Bearer ${getToken()}` },
            })
          )
        );
        setSelectedIds([]);
        await fetchProducts();
      } catch (err) {
        console.error(err);
        alert("حدث خطأ أثناء الحذف");
      }
    };
  
    return (
      <>
        {/* Back */}
        <button className="adm-back" onClick={() => { setActiveCategory(null); setSelectedIds([]); }}>
          &#8592; العودة إلى الفئات
        </button>
  
        {/* Category header card */}
        <div className="adm-detail-header">
          <div className="adm-detail-header-left">
            <img src={cat.image} alt={cat.name} className="adm-detail-img" />
            <div>
              <p className="adm-detail-title">{cat.name}</p>
              <p className="adm-detail-subtitle">{catProducts.length} منتج في هذه الفئة</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="adm-btn-base adm-btn-edit" onClick={() => { setSelectedCategory(cat); setOpenEditCategory(true); }}>
              تعديل الفئة
            </button>
            <button className="adm-btn-base adm-btn-delete" onClick={() => deleteCategory(cat.id)}>
              حذف الفئة
            </button>
          </div>
        </div>
  
        {/* Products section */}
        <div className="adm-section-row">
          <h2 className="adm-section-title">المنتجات</h2>
          <button className="adm-btn-base adm-btn-dark" onClick={() => setOpenAddProduct(true)}>
            + إضافة منتج
          </button>
        </div>
  
        {/* Bulk delete bar — shown only when something is selected */}
        {selectedIds.length > 0 && (
          <div className="adm-bulk-bar">
            <span>تم تحديد {selectedIds.length} منتج</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="adm-btn-base adm-btn-select-all" onClick={toggleSelectAll}>
                {allSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
              </button>
              <button className="adm-btn-base adm-btn-delete" onClick={deleteSelected}>
                حذف المحدد
              </button>
            </div>
          </div>
        )}
  
        <div className="adm-product-list">
          {catProducts.length === 0 ? (
            <div className="adm-empty">لا توجد منتجات في هذه الفئة بعد</div>
          ) : (
            catProducts.map((product) => (
              <div
                key={product.id}
                className="adm-product-card"
                style={selectedIds.includes(product.id) ? { borderColor: "#ffc5c5", background: "#fff8f8" } : {}}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="adm-checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={() => toggleSelect(product.id)}
                />
  
                <div className="adm-product-left">
                  <img src={product.images?.[0]?.image_url} alt={product.title} className="adm-product-img" />
                  <div className="adm-product-info">
                    <h2>{product.title}</h2>
                    <p>{product.price} دج</p>
                  </div>
                </div>
  
                <div className="adm-product-actions">
                  <button className="adm-btn-base adm-btn-edit" onClick={() => { setSelectedProduct(product); setOpenEditProduct(true); }}>
                    تعديل
                  </button>
                  <button className="adm-btn-base adm-btn-delete" onClick={() => deleteProduct(product.id)}>
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
  
        {/* Select-all shortcut at the bottom when nothing selected yet */}
        {catProducts.length > 1 && selectedIds.length === 0 && (
          <button
            className="adm-btn-base adm-btn-select-all adm-btn-outline"
            style={{ marginTop: 16 }}
            onClick={toggleSelectAll}
          >
            ☑ تحديد الكل
          </button>
        )}
      </>
    );
  };

  /* ─────────────────────────────────────────────
     MAIN RENDER
  ───────────────────────────────────────────── */
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
          <button className="adm-btn-base adm-btn-outline" onClick={logout}>
            تسجيل الخروج
          </button>
        </div>

        {/* Main content: grid OR detail */}
        {activeCategory ? renderDetail() : renderGrid()}

        {/* ── Modals ── */}
        <AddProductModal
          open={openAddProduct}
          onClose={() => setOpenAddProduct(false)}
          onSuccess={fetchProducts}
          defaultCategoryId={activeCategory?.id}
        />

        <EditProductModal
          open={openEditProduct}
          onClose={() => setOpenEditProduct(false)}
          product={selectedProduct}
          onSuccess={fetchProducts}
        />

        <AddCategoryModal
          open={openAddCategory}
          onClose={() => setOpenAddCategory(false)}
          onSuccess={fetchCategories}
        />

        <EditCategoryModal
          open={openEditCategory}
          onClose={() => setOpenEditCategory(false)}
          category={selectedCategory}
          onSuccess={async () => {
            await fetchCategories();
            /* keep detail view in sync after a name/image edit */
            setActiveCategory((prev) =>
              prev ? { ...prev, ...selectedCategory } : prev
            );
          }}
        />
      </div>
    </>
  );
}