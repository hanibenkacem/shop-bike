import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AddProductModal({ open, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category_id: "",
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    size: "",
    color: "",
    whatsapp_number: "+213794434949"
  });

  const [images, setImages] = useState([]);
  // 1. New state to track the main image index
  const [mainImageIndex, setMainImageIndex] = useState(0); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    // Convert FileList to Array so we can map through it for previews
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setMainImageIndex(0); // Reset to first image when new files are picked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in form) {
        formData.append(key, form[key]);
      }

      // 2. Append the main image index to the backend
      formData.append("mainImageIndex", mainImageIndex);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await API.post("/products", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("تم إضافة المنتج بنجاح");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2>إضافة منتج</h2>
          <button onClick={onClose} style={closeBtn}>X</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ... [Rest of your inputs (Category, Title, Price, etc.) remain exactly the same] ... */}
          <select name="category_id" value={form.category_id} onChange={handleChange} required style={inputStyle}>
            <option value="">اختر الفئة</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <input type="text" name="title" placeholder="اسم الدراجة" value={form.title} onChange={handleChange} required style={inputStyle} />
          <textarea name="description" placeholder="الوصف" value={form.description} onChange={handleChange} rows="4" style={inputStyle} />
          <input type="number" name="price" placeholder="السعر" value={form.price} onChange={handleChange} required style={inputStyle} />
          <input 
  type="number" 
  name="stock" 
  placeholder="الكمية المتاحة" 
  value={form.stock} 
  onChange={handleChange} 
  required 
  style={inputStyle} 
/>
<input type="text" name="size" placeholder="المقاس" value={form.size} onChange={handleChange} style={inputStyle} />
<input type="text" name="color" placeholder="اللون" value={form.color} onChange={handleChange} style={inputStyle} />
          <input type="text" name="brand" placeholder="العلامة التجارية" value={form.brand} onChange={handleChange} style={inputStyle} />
          <input type="text" name="whatsapp_number" placeholder="رقم واتساب" value={form.whatsapp_number} onChange={handleChange} required style={inputStyle} />

          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>صور المنتج (اختر الصورة الرئيسية):</label>
          <input type="file" multiple onChange={handleImages} style={{ marginBottom: "20px" }} />

          {/* 3. Preview Section */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", 
            gap: "10px", 
            marginBottom: "20px" 
          }}>
            {images.map((file, index) => (
              <div 
                key={index} 
                onClick={() => setMainImageIndex(index)}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  border: mainImageIndex === index ? "3px solid #007bff" : "1px solid #ccc",
                  borderRadius: "8px",
                  overflow: "hidden",
                  padding: "2px"
                }}
              >
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="preview" 
                  style={{ width: "100%", height: "80px", objectFit: "cover" }} 
                />
                {mainImageIndex === index && (
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    background: "#007bff",
                    color: "white",
                    width: "100%",
                    fontSize: "10px",
                    textAlign: "center"
                  }}>
                    الرئيسية
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} style={submitBtn}>
            {loading ? "جاري الإضافة..." : "إضافة المنتج"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ... [Keep your existing styles at the bottom]
 

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "14px",
  width: "90%",
  maxWidth: "700px",
  maxHeight: "90vh",
  overflowY: "auto"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const submitBtn = {
  width: "100%",
  padding: "15px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const closeBtn = {
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "5px 10px",
  cursor: "pointer"
};