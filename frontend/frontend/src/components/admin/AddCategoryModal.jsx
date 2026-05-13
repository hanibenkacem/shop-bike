import { useState } from "react";
import { generateSlug } from "../../utils/slugify";
import API from "../../api/axios";

export default function AddCategoryModal({
  open,
  onClose,
  onSuccess
}) {

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const token = localStorage.getItem("token");
      const slug = generateSlug(name);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("slug",slug)
      formData.append("image", image);
      
      await API.post(
        "/categories",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("تم إضافة الفئة");

      setName("");

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

        <div style={headerStyle}>

          <h2>إضافة فئة</h2>

          <button
            onClick={onClose}
            style={closeBtn}
          >
            X
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="اسم الفئة"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
            style={inputStyle}
          />
<input
  type="file"
  onChange={(e) =>
    setImage(e.target.files[0])
  }
  required
  style={{
    marginBottom: "20px"
  }}
/>

          <button
            type="submit"
            disabled={loading}
            style={submitBtn}
          >
            {loading
              ? "جاري الإضافة..."
              : "إضافة الفئة"}
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
  maxWidth: "500px"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "20px"
};

const submitBtn = {
  width: "100%",
  padding: "14px",
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
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer"
};