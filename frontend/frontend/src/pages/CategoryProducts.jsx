import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import MainLayout from "../layouts/MainLayout";

/* ── SIMPLE & CLEAN STYLES ── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

  .cp-wrap {
    min-height: 100vh;
    background: #f9f9f9;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    color: #222;
  }

  .cp-header {
    background: white;
    padding: 30px 5% 20px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  .cp-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #111;
  }

  .cp-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px 80px;
  }

  .cp-filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
  }

  .cp-count {
    font-size: 1rem;
    color: #555;
  }

  .cp-count strong {
    color: #222;
  }

  /* search input */
  .cp-search-wrap {
    position: relative;
    flex: 1;
    max-width: 360px;
  }

  .cp-search-input {
    width: 100%;
    border: 1px solid #ddd;
    padding: 8px 40px 8px 16px;
    border-radius: 6px;
    font-family: 'Cairo', sans-serif;
    font-size: 0.95rem;
    color: #333;
    background: white;
    transition: border 0.2s;
    box-sizing: border-box;
  }

  .cp-search-input::placeholder {
    color: #aaa;
  }

  .cp-search-input:focus {
    border-color: #888;
    outline: none;
  }

  .cp-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    pointer-events: none;
    font-size: 1rem;
  }

  .cp-search-clear {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0;
    transition: color 0.2s;
  }

  .cp-search-clear:hover {
    color: #333;
  }

  .cp-sort-select {
    border: 1px solid #ddd;
    padding: 8px 16px;
    border-radius: 6px;
    font-family: 'Cairo', sans-serif;
    font-weight: 600;
    background: white;
    color: #333;
    cursor: pointer;
    transition: border 0.2s;
  }

  .cp-sort-select:hover,
  .cp-sort-select:focus {
    border-color: #888;
    outline: none;
  }

  .cp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }

  /* simple product card wrapper */
  .cp-card {
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .cp-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-3px);
  }

  /* skeleton loading */
  .cp-skeleton {
    background: #ececec;
    border-radius: 8px;
    height: 280px;
    animation: pulse 1.8s infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  /* empty state */
  .cp-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 12px;
    border: 1px dashed #ddd;
  }

  .cp-empty h2 {
    margin-bottom: 10px;
    color: #333;
  }

  .cp-empty p {
    color: #777;
    margin-bottom: 25px;
  }

  .cp-btn {
    display: inline-block;
    padding: 10px 24px;
    background: #222;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    transition: background 0.2s;
  }

  .cp-btn:hover {
    background: #444;
  }
`;

export default function CategoryProducts() {
  const { categorySlug } = useParams();
  const categoryId = categorySlug.split("-")[0];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("price-asc");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts(categoryId);
  }, [categoryId]);

  const fetchProducts = async (categoryId) => {
    setLoading(true);
    try {
      const res = await API.get(`/products/category/${categoryId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSorted = () => {
    let arr = [...products];

    // 1. Filter by search query
    const query = search.trim().toLowerCase();
    if (query) {
      arr = arr.filter((p) =>
        (p.name || p.title || "").toLowerCase().includes(query)
      );
    }

    // 2. Sort
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);

    return arr;
  };

  const filtered = getFilteredAndSorted();

  return (
    <MainLayout>
      <>
        <style>{css}</style>
        <div className="cp-wrap">
          {/* Header */}
          <header className="cp-header">
            <h1>الدراجات</h1>
          </header>

          <main className="cp-container">
            {/* Filter bar */}
            <div className="cp-filter-bar">
              {/* Count */}
              <div className="cp-count">
                <strong>{loading ? "—" : filtered.length}</strong> دراجة
              </div>

              {/* Search input */}
              <div className="cp-search-wrap">
                <input
                  type="text"
                  className="cp-search-input"
                  placeholder="ابحث عن دراجة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search ? (
                  <button
                    className="cp-search-clear"
                    onClick={() => setSearch("")}
                    aria-label="مسح البحث"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="cp-search-icon">🔍</span>
                )}
              </div>

              {/* Sort */}
              <select
                className="cp-sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="price-asc" >الأقل سعراً</option>
                <option value="price-desc">الأعلى سعراً</option>
              </select>
            </div>

            {/* Product grid */}
            <div className="cp-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="cp-skeleton" />
                ))
              ) : filtered.length === 0 ? (
                <div className="cp-empty">
                  {search ? (
                    <>
                      <h2>لا توجد نتائج لـ "{search}"</h2>
                      <p>جرّب كلمة بحث مختلفة أو تصفح جميع الدراجات</p>
                      <button className="cp-btn" onClick={() => setSearch("")}>
                        مسح البحث
                      </button>
                    </>
                  ) : (
                    <>
                      <h2>لا توجد دراجات حالياً</h2>
                      <p>يرجى التحقق لاحقاً أو العودة للصفحة الرئيسية</p>
                      <Link to="/" className="cp-btn">
                        العودة للرئيسية
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                filtered.map((product) => (
                  <div key={product.id} className="cp-card">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </>
    </MainLayout>
  );
}