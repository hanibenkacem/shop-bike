import { useEffect, useRef, useState } from "react";
import API from "../../api/axios";

/* ── STYLES ── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

  .epm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 16px;
  }

  .epm-modal {
    background: #fff;
    border-radius: 18px;
    width: 100%;
    max-width: 680px;
    max-height: 92vh;
    overflow-y: auto;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
  }

  /* sticky header */
  .epm-header {
    position: sticky;
    top: 0;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
  }
  .epm-header h2 { margin: 0; font-size: 1.25rem; font-weight: 700; color: #111; }
  .epm-close {
    background: none;
    border: none;
    font-size: 1.3rem;
    color: #888;
    cursor: pointer;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .epm-close:hover { background: #f5f5f5; color: #111; }

  .epm-body { padding: 24px 28px 28px; }

  /* section label */
  .epm-section {
    font-size: 0.8rem;
    font-weight: 700;
    color: #888;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0 0 12px 0;
  }

  /* ── Images ── */
  .epm-images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
  }

  .epm-img-thumb {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 1;
    background: #f5f5f5;
    border: 1px solid #eee;
  }

  .epm-img-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .epm-img-del {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,0.65);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transition: background 0.15s;
  }
  .epm-img-del:hover { background: #cc2222; }

  .epm-img-new {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 1;
    background: #f5f5f5;
    border: 1px dashed #bbb;
  }
  .epm-img-new img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .epm-img-new-del {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,0.65);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .epm-img-new-del:hover { background: #cc2222; }

  /* upload zone */
  .epm-upload-zone {
    border: 1.5px dashed #ccc;
    border-radius: 10px;
    padding: 18px;
    text-align: center;
    cursor: pointer;
    color: #999;
    font-size: 0.88rem;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 24px;
  }
  .epm-upload-zone:hover { border-color: #555; background: #fafafa; color: #555; }
  .epm-upload-zone .icon { font-size: 1.4rem; margin-bottom: 4px; }

  /* ── Video ── */
  .epm-video-current {
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
    background: #000;
    max-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .epm-video-current video { width: 100%; max-height: 200px; display: block; }

  .epm-video-clear {
    background: #fff1f1;
    color: #cc2222;
    border: 1px solid #ffc5c5;
    border-radius: 8px;
    padding: 8px 16px;
    font-family: 'Cairo', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .epm-video-clear:hover { background: #ffe0e0; }

  .epm-video-preview {
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
    border: 1.5px dashed #aaa;
    background: #000;
    max-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .epm-video-preview video { width: 100%; max-height: 200px; display: block; }

  /* ── Form fields ── */
  .epm-field {
    width: 100%;
    padding: 13px 14px;
    margin-bottom: 14px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-family: 'Cairo', sans-serif;
    font-size: 0.95rem;
    box-sizing: border-box;
    background: #fafafa;
    transition: border-color 0.15s;
    direction: rtl;
  }
  .epm-field:focus { outline: none; border-color: #888; background: #fff; }

  .epm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }

  /* ── Divider ── */
  .epm-divider { border: none; border-top: 1px solid #f0f0f0; margin: 20px 0; }

  /* ── Submit ── */
  .epm-submit {
    width: 100%;
    padding: 15px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Cairo', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s;
  }
  .epm-submit:hover { background: #333; }
  .epm-submit:disabled { background: #aaa; cursor: not-allowed; }

  /* ── Tag pill for "new" images ── */
  .epm-badge-new {
    position: absolute;
    bottom: 4px;
    left: 4px;
    background: #1a1a1a;
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    border-radius: 4px;
    padding: 2px 5px;
  }

  @media (max-width: 480px) {
    .epm-body { padding: 18px 16px 24px; }
    .epm-header { padding: 16px 18px; }
    .epm-grid-2 { grid-template-columns: 1fr; }
  }
`;

export default function EditProductModal({ open, onClose, product, onSuccess }) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  /* existing images from server */
  const [existingImages, setExistingImages] = useState([]);
  /* ids of existing images the user wants to delete */
  const [imagesToDelete, setImagesToDelete] = useState([]);

  /* newly picked image files (not yet uploaded) */
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  /* video state */
  const [existingVideoUrl, setExistingVideoUrl] = useState("");
  const [clearExistingVideo, setClearExistingVideo] = useState(false);
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [newVideoPreview, setNewVideoPreview] = useState("");

  const [form, setForm] = useState({
    category_id: "",
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    size: "",
    color: "",
    whatsapp_number: "",
  });

  /* ── Populate form when product changes ── */
  useEffect(() => {
    if (!product) return;

    setForm({
      category_id:    product.category_id    || "",
      title:          product.title          || "",
      description:    product.description    || "",
      price:          product.price          || "",
      stock:          product.stock          || "",
      brand:          product.brand          || "",
      size:           product.size           || "",
      color:          product.color          || "",
      whatsapp_number: product.whatsapp_number || "",
    });

    setExistingImages(product.images || []);
    setImagesToDelete([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);

    setExistingVideoUrl(product.video_url || "");
    setClearExistingVideo(false);
    setNewVideoFile(null);
    setNewVideoPreview("");
  }, [product]);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  /* ── Field change ── */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ── Image helpers ── */
  const markImageForDelete = (imageId) =>
    setImagesToDelete((prev) => [...prev, imageId]);

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setNewImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setNewImagePreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });

    /* reset input so the same file can be re-picked */
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Video helpers ── */
  const handleNewVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewVideoFile(file);
    setNewVideoPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeNewVideo = () => {
    setNewVideoFile(null);
    setNewVideoPreview("");
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      /* 1. Update text fields */
      await API.put(`/products/${product.id}`, form, { headers });

      /* 2. Delete marked images */
      await Promise.all(
        imagesToDelete.map((imgId) =>
          API.delete(`/products/${product.id}/images/${imgId}`, { headers })
        )
      );

      /* 3. Upload new images */
      if (newImageFiles.length > 0) {
        const imgForm = new FormData();
        newImageFiles.forEach((file) => imgForm.append("images", file));
        await API.post(`/products/${product.id}/images`, imgForm, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      }

      /* 4. Handle video */
      if (newVideoFile) {
        const vidForm = new FormData();
        vidForm.append("video", newVideoFile);
        await API.post(`/products/${product.id}/video`, vidForm, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      } else if (clearExistingVideo && existingVideoUrl) {
        await API.delete(`/products/${product.id}/video`, { headers });
      }

      alert("تم تعديل المنتج بنجاح");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const visibleExisting = existingImages.filter(
    (img) => !imagesToDelete.includes(img.id)
  );
  const showVideoSection =
    (existingVideoUrl && !clearExistingVideo) || newVideoPreview;

  return (
    <>
      <style>{css}</style>

      <div className="epm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="epm-modal">

          {/* ── Header ── */}
          <div className="epm-header">
            <h2>تعديل المنتج</h2>
            <button className="epm-close" onClick={onClose}>✕</button>
          </div>

          <div className="epm-body">
            <form onSubmit={handleSubmit}>

              {/* ════════════════════════════
                  IMAGES
              ════════════════════════════ */}
              <p className="epm-section">الصور</p>

              <div className="epm-images-grid">
                {/* Existing images */}
                {visibleExisting.map((img) => (
                  <div key={img.id} className="epm-img-thumb">
                    <img src={img.image_url} alt="" />
                    <button
                      type="button"
                      className="epm-img-del"
                      title="حذف الصورة"
                      onClick={() => markImageForDelete(img.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* New (not yet uploaded) images */}
                {newImagePreviews.map((src, i) => (
                  <div key={`new-${i}`} className="epm-img-new">
                    <img src={src} alt="" />
                    <button
                      type="button"
                      className="epm-img-new-del"
                      onClick={() => removeNewImage(i)}
                    >
                      ✕
                    </button>
                    <span className="epm-badge-new">جديد</span>
                  </div>
                ))}
              </div>

              {/* Upload zone */}
              <div
                className="epm-upload-zone"
                onClick={() => imageInputRef.current?.click()}
              >
                <div className="icon">🖼️</div>
                انقر لإضافة صور جديدة (يمكن اختيار أكثر من صورة)
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleNewImages}
                />
              </div>

              <hr className="epm-divider" />

              {/* ════════════════════════════
                  VIDEO
              ════════════════════════════ */}
              <p className="epm-section">الفيديو</p>

              {/* Current saved video */}
              {existingVideoUrl && !clearExistingVideo && !newVideoPreview && (
                <>
                  <div className="epm-video-current">
                    <video src={existingVideoUrl} controls />
                  </div>
                  <button
                    type="button"
                    className="epm-video-clear"
                    onClick={() => setClearExistingVideo(true)}
                  >
                    ✕ حذف الفيديو الحالي
                  </button>
                </>
              )}

              {/* New video preview */}
              {newVideoPreview && (
                <>
                  <div className="epm-video-preview">
                    <video src={newVideoPreview} controls />
                  </div>
                  <button
                    type="button"
                    className="epm-video-clear"
                    onClick={removeNewVideo}
                  >
                    ✕ إلغاء الفيديو الجديد
                  </button>
                </>
              )}

              {/* Upload zone — hide when a new video is already chosen */}
              {!newVideoPreview && (
                <div
                  className="epm-upload-zone"
                  onClick={() => videoInputRef.current?.click()}
                  style={{ marginBottom: 24 }}
                >
                  <div className="icon">🎬</div>
                  {existingVideoUrl && !clearExistingVideo
                    ? "انقر لاستبدال الفيديو"
                    : "انقر لرفع فيديو للمنتج"}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={handleNewVideo}
                  />
                </div>
              )}

              <hr className="epm-divider" />

              {/* ════════════════════════════
                  TEXT FIELDS
              ════════════════════════════ */}
              <p className="epm-section">بيانات المنتج</p>

              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="epm-field"
              >
                <option value="">اختر الفئة</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="title"
                placeholder="اسم المنتج"
                value={form.title}
                onChange={handleChange}
                required
                className="epm-field"
              />

              <textarea
                name="description"
                placeholder="الوصف"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="epm-field"
              />

              <div className="epm-grid-2">
                <input
                  type="number"
                  name="price"
                  placeholder="السعر (دج)"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="epm-field"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="الكمية"
                  value={form.stock}
                  onChange={handleChange}
                  className="epm-field"
                />
              </div>

              <div className="epm-grid-2">
                <input
                  type="text"
                  name="brand"
                  placeholder="العلامة التجارية"
                  value={form.brand}
                  onChange={handleChange}
                  className="epm-field"
                />
                <input
                  type="text"
                  name="size"
                  placeholder="الحجم"
                  value={form.size}
                  onChange={handleChange}
                  className="epm-field"
                />
              </div>

              <div className="epm-grid-2">
                <input
                  type="text"
                  name="color"
                  placeholder="اللون"
                  value={form.color}
                  onChange={handleChange}
                  className="epm-field"
                />
                <input
                  type="text"
                  name="whatsapp_number"
                  placeholder="رقم واتساب"
                  value={form.whatsapp_number}
                  onChange={handleChange}
                  className="epm-field"
                />
              </div>

              <button
                type="submit"
                className="epm-submit"
                disabled={loading}
              >
                {loading ? "جاري الحفظ…" : "حفظ التعديلات"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}