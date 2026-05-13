import { useEffect, useState } from "react";
import API from "../../api/axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

  .ecm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .ecm-box {
    background: #ffffff;
    border-radius: 20px;
    width: 100%;
    max-width: 460px;
    padding: 36px 32px 28px;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    position: relative;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  }

  .ecm-close {
    position: absolute;
    top: 16px;
    left: 16px;
    background: #f3f3f3;
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    cursor: pointer;
  }

  .ecm-title {
    font-size: 1.45rem;
    font-weight: 800;
    margin-bottom: 6px;
  }

  .ecm-subtitle {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 28px;
  }

  .ecm-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 7px;
  }

  .ecm-input {
    width: 100%;
    border: 1.5px solid #e5e5e5;
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'Cairo', sans-serif;
    background: #fafafa;
    outline: none;
  }

  .ecm-input:focus {
    border-color: #1a1a1a;
    background: #fff;
  }

  .ecm-field {
    margin-bottom: 20px;
  }

  .ecm-preview-wrap {
    margin-top: 14px;
    border-radius: 12px;
    overflow: hidden;
    border: 1.5px solid #eee;
  }

  .ecm-preview-img {
    width: 100%;
    height: 170px;
    object-fit: cover;
  }

  .ecm-preview-badge {
    position: absolute;
    margin-top: -30px;
    margin-right: 10px;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 12px;
  }

  .ecm-divider {
    height: 1px;
    background: #f0f0f0;
    margin: 24px 0;
  }

  .ecm-actions {
    display: flex;
    gap: 10px;
  }

  .ecm-btn-save {
    flex: 1;
    background: #1a1a1a;
    color: white;
    border: none;
    padding: 13px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 700;
  }

  .ecm-btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ecm-btn-cancel {
    background: #f3f3f3;
    border: none;
    padding: 13px;
    border-radius: 10px;
    cursor: pointer;
  }

  .ecm-error {
    background: #fff3f3;
    border: 1px solid #ffcece;
    color: #c0392b;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 13px;
  }
`;

export default function EditCategoryModal({
  open,
  onClose,
  category,
  onSuccess,
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setImage(category.image || "");
      setPreview(category.image || "");
      setError("");
    }
  }, [category]);

  if (!open) return null;

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError("يرجى إدخال اسم الفئة");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      await API.put(
        `/categories/${category.id}`,
        {
          name,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء التعديل"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{css}</style>

      <div
        className="ecm-backdrop"
        onClick={handleBackdrop}
      >
        <div className="ecm-box">
          <button
            className="ecm-close"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="ecm-title">تعديل الفئة</h2>
          <p className="ecm-subtitle">
            تعديل الاسم والصورة
          </p>

          {error && (
            <div className="ecm-error">{error}</div>
          )}

          {/* Name */}
          <div className="ecm-field">
            <label className="ecm-label">
              اسم الفئة
            </label>
            <input
              className="ecm-input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          {/* Image URL */}
          <div className="ecm-field">
            <label className="ecm-label">
              رابط الصورة (Cloudinary)
            </label>
            <input
              className="ecm-input"
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                setPreview(e.target.value);
              }}
              placeholder="https://res.cloudinary.com/..."
            />

            {preview && (
              <div className="ecm-preview-wrap">
                <img
                  src={preview}
                  className="ecm-preview-img"
                />
                <span className="ecm-preview-badge">
                  preview
                </span>
              </div>
            )}
          </div>

          <div className="ecm-divider" />

          {/* Actions */}
          <div className="ecm-actions">
            <button
              className="ecm-btn-save"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading
                ? "جارٍ الحفظ..."
                : "حفظ التغييرات"}
            </button>

            <button
              className="ecm-btn-cancel"
              onClick={onClose}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </>
  );
}