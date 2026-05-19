import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import MainLayout from "../layouts/MainLayout";

/* ── Store-wide social links – edit these once ── */
const SOCIAL = {
  instagram: "https://www.instagram.com/worldbikesetif",
  tiktok:    "https://www.tiktok.com/@issam.cycle",
  facebook:  "https://www.facebook.com/groups/1439452979687628/user/100056417477627/",
  whatsapp:  null,   // filled dynamically from product.whatsapp_number
};

/* ── Shop locations ── */
const SHOPS = [
  {
    name:   "World Bike 1",
    mapUrl: "https://maps.app.goo.gl/ddCJXD9acyNx6KuYA",
    coords: "36.2072173, 5.4465243",
  },
  {
    name:   "World Bike 2",
    mapUrl: "https://maps.app.goo.gl/HbmHcPMqdAJec6eJ6",
    coords: "36.2063963, 5.4178767",
  },
];

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
    padding: 2rem 1rem 4rem;
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
  .pd-back:hover { color: var(--accent-orange); }

  /* ── Main card ── */
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

  /* ── Gallery ── */
  .pd-gallery { flex: 1 1 400px; min-width: 280px; }

  .pd-img-container {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #eee;
    background: white;
  }

  .pd-main-img {
    width: 100%;
    border-radius: 12px;
    object-fit: cover;
    max-height: 500px;
    display: block;
  }

  .pd-main-video {
    width: 100%;
    max-height: 500px;
    display: block;
    background: #000;
    border-radius: 12px;
  }

  .pd-lens {
    position: absolute;
    width: 150px;
    height: 150px;
    border: 3px solid var(--accent-orange);
    border-radius: 50%;
    background-repeat: no-repeat;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    pointer-events: none;
    z-index: 10;
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
    flex-shrink: 0;
  }
  .pd-thumb:hover,
  .pd-thumb.active {
    border-color: var(--accent-orange);
    transform: scale(1.05);
  }

  .pd-video-thumb {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    border: 2px solid var(--border);
    cursor: pointer;
    transition: 0.2s;
    flex-shrink: 0;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .pd-video-thumb.active {
    border-color: var(--accent-orange);
    transform: scale(1.05);
  }
  .pd-video-thumb span { color: white; font-size: 28px; }

  /* ── Info panel ── */
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
  }

  /* ════════════════════════════════════════
     DESCRIPTION SECTION (bottom)
  ════════════════════════════════════════ */
  .pd-desc-section {
    background: var(--card-bg);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    padding: 2rem 2.5rem;
    margin-bottom: 2rem;
  }

  .pd-section-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--primary-dark);
    margin: 0 0 1.4rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--accent-orange);
    display: inline-block;
  }

  .pd-desc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pd-desc-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-muted);
    padding: 12px 16px;
    background: #fafafa;
    border-radius: 10px;
    border-right: 3px solid var(--accent-orange);
  }

  .pd-desc-bullet {
    width: 8px;
    height: 8px;
    min-width: 8px;
    background: var(--accent-orange);
    border-radius: 50%;
    margin-top: 8px;
  }

  /* ════════════════════════════════════════
     SHOPS LOCATIONS SECTION
  ════════════════════════════════════════ */
  .pd-shops-section {
    background: var(--card-bg);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    padding: 2rem 2.5rem;
    margin-bottom: 2rem;
  }

  .pd-shops-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .pd-shop-card {
    flex: 1 1 220px;
    display: flex;
    align-items: center;
    gap: 14px;
    background: #fafafa;
    border-radius: 14px;
    padding: 16px 20px;
    border: 1px solid var(--border);
    text-decoration: none;
    color: var(--text-dark);
    transition: 0.2s;
  }
  .pd-shop-card:hover {
    border-color: var(--accent-orange);
    box-shadow: 0 4px 16px rgba(240,78,35,0.12);
    transform: translateY(-2px);
  }

  .pd-shop-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .pd-shop-info { display: flex; flex-direction: column; gap: 2px; }

  .pd-shop-name {
    font-weight: 800;
    font-size: 1rem;
    color: var(--primary-dark);
  }

  .pd-shop-coords {
    font-size: 0.78rem;
    color: var(--text-muted);
    direction: ltr;
  }

  .pd-shop-link-label {
    font-size: 0.82rem;
    color: var(--accent-orange);
    font-weight: 700;
    margin-top: 2px;
  }

  /* ════════════════════════════════════════
     SOCIAL MEDIA SECTION (bottom)
  ════════════════════════════════════════ */
  .pd-social-section {
    background: var(--primary-dark);
    border-radius: 20px;
    padding: 2rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .pd-social-text h3 {
    font-size: 1.2rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 4px 0;
  }
  .pd-social-text p {
    font-size: 0.9rem;
    color: #aaa;
    margin: 0;
  }

  .pd-social-links {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .pd-social-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 50px;
    text-decoration: none;
    font-family: 'Cairo', sans-serif;
    font-weight: 700;
    font-size: 0.92rem;
    transition: 0.2s;
    white-space: nowrap;
  }

  .pd-social-btn svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    flex-shrink: 0;
  }

  .pd-social-btn.instagram {
    background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);
    color: #fff;
  }
  .pd-social-btn.instagram:hover { opacity: 0.88; transform: translateY(-2px); }

  .pd-social-btn.tiktok {
    background: #010101;
    color: #fff;
    border: 1px solid #333;
  }
  .pd-social-btn.tiktok:hover { background: #222; transform: translateY(-2px); }

  .pd-social-btn.facebook {
    background: #1877F2;
    color: #fff;
  }
  .pd-social-btn.facebook:hover { background: #1464d2; transform: translateY(-2px); }

  .pd-social-btn.whatsapp {
    background: #25D366;
    color: #fff;
  }
  .pd-social-btn.whatsapp:hover { background: #1ebd5a; transform: translateY(-2px); }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .pd-card { padding: 1rem; }
    .pd-title { font-size: 1.5rem; }
    .pd-price { font-size: 1.4rem; }
    .pd-lens  { width: 100px; height: 100px; }
    .pd-desc-section { padding: 1.5rem 1.25rem; }
    .pd-shops-section { padding: 1.5rem 1.25rem; }
    .pd-social-section { padding: 1.5rem 1.25rem; }
    .pd-social-links { gap: 10px; }
    .pd-social-btn { padding: 10px 14px; font-size: 0.85rem; }
  }
`;

/* ── SVG icons ── */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 1.955 2.073.555 3.473.039 5.315-.046 7.17-.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.085 1.855.601 3.697 2.001 5.097 1.4 1.4 3.242 1.916 5.097 2.001C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.097-2.001 1.4-1.4 1.916-3.242 2.001-5.097C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-2.001-5.097C20.527.673 18.685.157 16.83.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

/**
 * Splits the description string into an array of non-empty lines.
 * Supports newlines (\n) and bullet-prefixed lines (-, •, *)
 */
const parseDescription = (text = "") =>
  text
    .split(/\n|(?<=\w)(?=[-•*]\s)/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct]       = useState(null);
  const [selectedMedia, setSelectedMedia] = useState({ type: "image", url: "" });

  const imgRef  = useRef(null);
  const lensRef = useRef(null);
  const [zoomVisible, setZoomVisible] = useState(false);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    try {
      const res  = await API.get(`/products/${id}`);
      const data = res.data;
      setProduct(data);
      if (data.images?.length > 0) {
        setSelectedMedia({ type: "image", url: data.images[0].image_url });
      }
    } catch (err) { console.error(err); }
  };

  const handleMouseMove = (e) => {
    if (selectedMedia.type !== "image") return;
    if (!imgRef.current || !lensRef.current) return;

    const img  = imgRef.current;
    const lens = lensRef.current;
    const rect = img.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const lensW = lens.offsetWidth  / 2;
    const lensH = lens.offsetHeight / 2;

    if (x < lensW) x = lensW;
    if (y < lensH) y = lensH;
    if (x > img.width  - lensW) x = img.width  - lensW;
    if (y > img.height - lensH) y = img.height - lensH;

    lens.style.left = `${x - lensW}px`;
    lens.style.top  = `${y - lensH}px`;

    const zoom = 2.5;
    lens.style.backgroundImage    = `url(${selectedMedia.url})`;
    lens.style.backgroundSize     = `${img.width * zoom}px ${img.height * zoom}px`;
    lens.style.backgroundPosition = `${-(x * zoom - lensW)}px ${-(y * zoom - lensH)}px`;
  };

  if (!product) {
    return (
      <>
        <style>{css}</style>
        <div className="pd-wrap">
          <div className="pd-container">جاري التحميل...</div>
        </div>
      </>
    );
  }

  const descLines = parseDescription(product.description);

  return (
    <MainLayout>
      <>
        <style>{css}</style>

        <div className="pd-wrap">
          <div className="pd-container">

            <Link to="/" className="pd-back">⬅ العودة للمتجر</Link>

            {/* ════════════════ MAIN CARD ════════════════ */}
            <div className="pd-card">

              {/* LEFT – gallery */}
              <div className="pd-gallery">
                <div
                  className="pd-img-container"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setZoomVisible(true)}
                  onMouseLeave={() => setZoomVisible(false)}
                >
                  {selectedMedia.type === "image" ? (
                    <>
                      <img
                        ref={imgRef}
                        src={selectedMedia.url}
                        alt={product.title}
                        className="pd-main-img"
                        draggable="false"
                      />
                      <div
                        ref={lensRef}
                        className="pd-lens"
                        style={{ display: zoomVisible ? "block" : "none" }}
                      />
                    </>
                  ) : (
                    <video
                      src={selectedMedia.url}
                      controls
                      className="pd-main-video"
                    />
                  )}
                </div>

                {/* thumbnails */}
                <div className="pd-thumbs">
                  {product.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img.image_url}
                      alt=""
                      className={`pd-thumb ${
                        selectedMedia.type === "image" &&
                        selectedMedia.url === img.image_url ? "active" : ""
                      }`}
                      onClick={() => setSelectedMedia({ type: "image", url: img.image_url })}
                    />
                  ))}
                  {product.video_url && (
                    <div
                      className={`pd-video-thumb ${selectedMedia.type === "video" ? "active" : ""}`}
                      onClick={() => setSelectedMedia({ type: "video", url: product.video_url })}
                    >
                      <span>▶</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT – info */}
              <div className="pd-info">
                <h1 className="pd-title">{product.title}</h1>
                <p className="pd-price">{product.price} DA</p>

                <div className="pd-specs">
                  {product.brand && <div className="pd-spec-item">🏷️ {product.brand}</div>}
                  {product.color && <div className="pd-spec-item">🎨 {product.color}</div>}
                  {product.size  && <div className="pd-spec-item">📏 {product.size}</div>}
                </div>

                <a
                  href={`https://wa.me/${product.whatsapp_number}?text=${encodeURIComponent(
                    `مرحباً، أريد طلب هذا المنتج:\n\n📌 المنتج: ${product.title}\n💰 السعر: ${product.price} DA\n\n🔗 الرابط:\n${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pd-whatsapp"
                >
                  📞 تواصل عبر واتساب
                </a>
              </div>
            </div>

            {/* ════════════════ DESCRIPTION LIST ════════════════ */}
            {descLines.length > 0 && (
              <div className="pd-desc-section">
                <h2 className="pd-section-title">مواصفات المنتج</h2>
                <ul className="pd-desc-list">
                  {descLines.map((line, i) => (
                    <li key={i} className="pd-desc-item">
                      <span className="pd-desc-bullet" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ════════════════ SHOP LOCATIONS ════════════════ */}
            <div className="pd-shops-section">
              <h2 className="pd-section-title">📍 مواقع متاجرنا</h2>
              <div className="pd-shops-grid">
                {SHOPS.map((shop) => (
                  <a
                    key={shop.name}
                    href={shop.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pd-shop-card"
                  >
                    <span className="pd-shop-icon">🏪</span>
                    <div className="pd-shop-info">
                      <span className="pd-shop-name">{shop.name}</span>
                      <span className="pd-shop-coords">{shop.coords}</span>
                      <span className="pd-shop-link-label">فتح في الخريطة ←</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* ════════════════ SOCIAL MEDIA ════════════════ */}
            <div className="pd-social-section">
              <div className="pd-social-text">
                <h3>تابعنا على منصات التواصل</h3>
                <p>آخر العروض والوصولات الجديدة</p>
              </div>

              <div className="pd-social-links">
                {SOCIAL.instagram && (
                  <a href={SOCIAL.instagram} target="_blank" rel="noreferrer"
                    className="pd-social-btn instagram">
                    <InstagramIcon /> Instagram
                  </a>
                )}
                {SOCIAL.tiktok && (
                  <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer"
                    className="pd-social-btn tiktok">
                    <TikTokIcon /> TikTok
                  </a>
                )}
                {SOCIAL.facebook && (
                  <a href={SOCIAL.facebook} target="_blank" rel="noreferrer"
                    className="pd-social-btn facebook">
                    <FacebookIcon /> Facebook
                  </a>
                )}
                {product.whatsapp_number && (
                  <a
                    href={`https://wa.me/${product.whatsapp_number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="pd-social-btn whatsapp"
                  >
                    <WhatsAppIcon /> WhatsApp
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </>
    </MainLayout>
  );
}