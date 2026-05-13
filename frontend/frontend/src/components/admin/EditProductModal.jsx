import { useEffect, useState } from "react";

import API from "../../api/axios";

export default function EditProductModal({
  open,
  onClose,
  product,
  onSuccess
}) {

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
    whatsapp_number: ""
  });

  useEffect(() => {

    if (product) {

      setForm({
        category_id: product.category_id || "",
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        brand: product.brand || "",
        size: product.size || "",
        color: product.color || "",
        whatsapp_number:
          product.whatsapp_number || ""
      });

    }

  }, [product]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {

    try {

      const res = await API.get("/categories");

      setCategories(res.data);

    } catch (error) {

      console.error(error);

    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/products/${product.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("تم تعديل المنتج");

      onSuccess();

      onClose();

    } catch (error) {

      console.error(error);

      alert("حدث خطأ");

    }

  };

  if (!open) return null;

  return (
    <div style={overlayStyle}>

      <div style={modalStyle}>

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >

          <h2>تعديل المنتج</h2>

          <button
            onClick={onClose}
            style={closeBtn}
          >
            X
          </button>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >

            <option value="">
              اختر الفئة
            </option>

            {categories.map(category => (

              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>

            ))}

          </select>

          <input
            type="text"
            name="title"
            placeholder="اسم الدراجة"
            value={form.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <textarea
            name="description"
            placeholder="الوصف"
            value={form.description}
            onChange={handleChange}
            rows="4"
            style={inputStyle}
          />

          <input
            type="number"
            name="price"
            placeholder="السعر"
            value={form.price}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="number"
            name="stock"
            placeholder="الكمية"
            value={form.stock}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="brand"
            placeholder="العلامة التجارية"
            value={form.brand}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="size"
            placeholder="الحجم"
            value={form.size}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="color"
            placeholder="اللون"
            value={form.color}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="whatsapp_number"
            placeholder="رقم واتساب"
            value={form.whatsapp_number}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            type="submit"
            style={submitBtn}
          >
            حفظ التعديلات
          </button>

        </form>

      </div>

    </div>
  );
}

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
  background: "orange",
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