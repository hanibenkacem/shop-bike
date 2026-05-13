import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import MainLayout from "../layouts/MainLayout";

/* ── BIKES SHOP STYLES (ZOOM + EXTRA DETAILS) ── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

  :root {
    --primary-dark: #1a1a1a;
    --accent-orange: #F04E23;
    --bg-light: #f5f5f5;
    --card-bg: #ffffff;
    --text-dark: #1e1e1e;
    --text-muted: #555;
    --border: #e0e0e0;
  }

  .pd-wrap {
    min-height: 100vh;
    background: var(--bg-light);
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    color: var(--text-dark);
    padding: 2rem 1rem;
  }

  .pd-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  .pd-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--primary-dark);
    text-decoration: none;
    font-weight: 700;
    margin-bottom: 2rem;
    transition: color 0.2s;
  }
  .pd-back:hover {
    color: var(--accent-orange);
  }

  .pd-card {
    background: var(--card-bg);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    padding: 2rem;
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  /* ── Image Gallery with Magnifier ── */
  .pd-gallery {
    flex: 1 1 400px;
    min-width: 280px;
  }

  .pd-img-container {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eee;
    cursor: crosshair;
  }

  .pd-main-img {
    width: 100%;
    border-radius: 12px;
    object-fit: cover;
    max-height: 500px;
    display: block;
  }

  /* Magnifier Lens */
  .pd-lens {
    position: absolute;
    width: 150px;
    height: 150px;
    border: 3px solid var(--accent-orange);
    border-radius: 50%;
    background-repeat: no-repeat;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    pointer-events: none;
    display: none;
    z-index: 10;
  }

  .pd-img-container:hover .pd-lens {
    display: block;
  }

  .pd-zoom-result {
    display: none;
  }

  .pd-thumbs {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
  }

  .pd-thumb {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid var(--border);
    cursor: pointer;
    transition: 0.2s;
  }
  .pd-thumb:hover,
  .pd-thumb.active {
    border-color: var(--accent-orange);
    transform: scale(1.05);
  }

  /* Product Info */
  .pd-info {
    flex: 1 1 300px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .pd-title {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.3;
    margin: 0;
    color: var(--primary-dark);
  }

  .pd-price {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--accent-orange);
    margin: 0;
  }

  .pd-specs {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 12px;
    margin: 0.5rem 0;
  }

  .pd-spec-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: var(--text-muted);
  }

  .pd-description {
    color: var(--text-muted);
    line-height: 1.8;
    margin: 0;
  }

  .pd-whatsapp {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--accent-orange);
    color: white;
    padding: 14px 28px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.05rem;
    margin-top: auto;
    width: fit-content;
    transition: 0.25s;
    box-shadow: 0 4px 12px rgba(240,78,35,0.3);
  }
  .pd-whatsapp:hover {
    background: #d13e1c;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(240,78,35,0.4);
  }

  /* ── Extra Details Section ── */
  .pd-extra {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .pd-detail-box {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    border: 1px solid #eee;
  }

  .pd-detail-box h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: var(--primary-dark);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pd-features-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pd-features-list li {
    padding: 0.5rem 0;
    border-bottom: 1px dashed #e0e0e0;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pd-features-list li:last-child {
    border-bottom: none;
  }

  .pd-delivery {
    background: #f0fdf4;
    border-left: 4px solid var(--accent-orange);
  }

  /* Loading / Error */
  .pd-state {
    text-align: center;
    padding: 5rem 2rem;
    font-weight: 700;
    color: var(--text-muted);
  }

  /* Responsive tweaks */
  @media (max-width: 600px) {
    .pd-card {
      padding: 1rem;
      gap: 1rem;
    }
    .pd-title {
      font-size: 1.5rem;
    }
    .pd-price {
      font-size: 1.4rem;
    }
    .pd-lens {
      width: 100px;
      height: 100px;
    }
    .pd-extra {
      grid-template-columns: 1fr;
    }
  }
`;

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  // Zoom state
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const [zoomVisible, setZoomVisible] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      const data = res.data;
      setProduct(data);

      if (data.images?.length > 0) {
        setSelectedImage(data.images[0].image_url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ── Magnifier Logic ──
  const handleMouseMove = (e) => {
    if (!imgRef.current || !lensRef.current) return;
    const img = imgRef.current;
    const lens = lensRef.current;

    // Get cursor position relative to image
    const rect = img.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Prevent lens from going outside
    const lensW = lens.offsetWidth / 2;
    const lensH = lens.offsetHeight / 2;
    if (x < lensW) x = lensW;
    if (y < lensH) y = lensH;
    if (x > img.width - lensW) x = img.width - lensW;
    if (y > img.height - lensH) y = img.height - lensH;

    // Position lens
    lens.style.left = `${x - lensW}px`;
    lens.style.top = `${y - lensH}px`;

    // Background zoom (show a portion of the image enlarged)
    const zoomLevel = 2.5; // adjust for more/less zoom
    const bgPosX = -(x * zoomLevel - lensW);
    const bgPosY = -(y * zoomLevel - lensH);
    lens.style.backgroundImage = `url(${selectedImage})`;
    lens.style.backgroundSize = `${img.width * zoomLevel}px ${img.height * zoomLevel}px`;
    lens.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  };

  const handleMouseEnter = () => setZoomVisible(true);
  const handleMouseLeave = () => setZoomVisible(false);

  if (!product) {
    return (
      <>
        <style>{css}</style>
        <div className="pd-wrap">
          <div className="pd-container pd-state">جاري التحميل...</div>
        </div>
      </>
    );
  }

  // Dummy features / extra content (replace with real data if available)
  const features = [
    "هيكل متين من الألمنيوم خفيف الوزن",
    "نظام تغيير سرعات سلس (شيمانو)",
    "فرامل قرصية أمامية وخلفية",
    "عجلات قياس 26 بوصة مناسبة لكل الطرق",
    "مقعد مريح قابل للتعديل",
    "ضمان لمدة سنتين ضد عيوب التصنيع",
  ];

  const deliveryInfo = [
    "🚚 توصيل مجاني للطلبات فوق 500 دج",
    "📦 التوصيل خلال 2-5 أيام عمل",
    "🔄 إمكانية الإرجاع خلال 14 يوم",
    "🔒 دفع آمن عند الاستلام",
  ];

  return (
    <MainLayout>
      <>
        <style>{css}</style>
        <div className="pd-wrap">
          <div className="pd-container">
            {/* Back button */}
            <Link to="/" className="pd-back">
              ⬅ العودة للمتجر
            </Link>

            <div className="pd-card">
              {/* ── Left side – gallery with magnifier ── */}
              <div className="pd-gallery">
                <div
                  className="pd-img-container"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {selectedImage && (
                    <img
                      ref={imgRef}
                      src={selectedImage}
                      alt={product.title}
                      className="pd-main-img"
                      draggable="false"
                    />
                  )}
                  <div
                    ref={lensRef}
                    className="pd-lens"
                    style={{ display: zoomVisible ? "block" : "none" }}
                  ></div>
                </div>

                {product.images?.length > 1 && (
  <div className="pd-thumbs">
    {product.images.map((image, index) => (
      <img
        key={index}
        src={image.image_url}
        alt=""
        className={`pd-thumb ${
          selectedImage === image.image_url ? "active" : ""
        }`}
        onClick={() => setSelectedImage(image.image_url)}
      />
    ))}
  </div>
)}
              </div>

              {/* ── Right side – details ── */}
              <div className="pd-info">
                <h1 className="pd-title">{product.title}</h1>
                <p className="pd-price">{product.price} DA</p>

                <div className="pd-specs">
                  {product.brand && (
                    <div className="pd-spec-item">🏷️ {product.brand}</div>
                  )}
                  {product.color && (
                    <div className="pd-spec-item">🎨 {product.color}</div>
                  )}
                  {product.size && (
                    <div className="pd-spec-item">📏 {product.size}</div>
                  )}
                </div>

                <p className="pd-description">{product.description}</p>

                <a
                  href={`https://wa.me/${product.whatsapp_number}?text=مرحباً، أريد ${product.title}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pd-whatsapp"
                >
                  📞 تواصل عبر واتساب
                </a>
              </div>
            </div>

            {/* ── Extra details (specifications, features, delivery) ── */}
            <div className="pd-extra">
              <div className="pd-detail-box">
                <h3>📋 مميزات الدراجة</h3>
                <ul className="pd-features-list">
                  {features.map((feat, idx) => (
                    <li key={idx}>✅ {feat}</li>
                  ))}
                </ul>
              </div>

              <div className="pd-detail-box pd-delivery">
                <h3>📦 معلومات التوصيل</h3>
                <ul className="pd-features-list">
                  {deliveryInfo.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>

              <div className="pd-detail-box">
                <h3>🛡️ الضمان وخدمة العملاء</h3>
                <p style={{ color: "#555", lineHeight: 1.8 }}>
                  نقدم ضمانًا شاملاً لمدة سنتين على جميع الدراجات. فريق دعمنا جاهز
                  للإجابة على استفساراتك عبر واتساب أو الهاتف من السبت إلى الخميس.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    </MainLayout>
  );
}