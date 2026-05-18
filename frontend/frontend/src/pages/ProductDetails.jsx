import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import MainLayout from "../layouts/MainLayout";

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
    overflow: hidden;
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
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .pd-video-thumb.active {
    border-color: var(--accent-orange);
    transform: scale(1.05);
  }

  .pd-video-thumb span {
    color: white;
    font-size: 30px;
    font-weight: bold;
  }

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
  }

  @media (max-width: 600px) {
    .pd-card {
      padding: 1rem;
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
  }
`;

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [selectedMedia, setSelectedMedia] = useState({
    type: "image",
    url: "",
  });

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
        setSelectedMedia({
          type: "image",
          url: data.images[0].image_url,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMouseMove = (e) => {
    if (selectedMedia.type !== "image") return;

    if (!imgRef.current || !lensRef.current) return;

    const img = imgRef.current;
    const lens = lensRef.current;

    const rect = img.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const lensW = lens.offsetWidth / 2;
    const lensH = lens.offsetHeight / 2;

    if (x < lensW) x = lensW;
    if (y < lensH) y = lensH;
    if (x > img.width - lensW) x = img.width - lensW;
    if (y > img.height - lensH) y = img.height - lensH;

    lens.style.left = `${x - lensW}px`;
    lens.style.top = `${y - lensH}px`;

    const zoomLevel = 2.5;

    const bgPosX = -(x * zoomLevel - lensW);
    const bgPosY = -(y * zoomLevel - lensH);

    lens.style.backgroundImage = `url(${selectedMedia.url})`;
    lens.style.backgroundSize = `${img.width * zoomLevel}px ${img.height * zoomLevel}px`;
    lens.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  };

  if (!product) {
    return (
      <>
        <style>{css}</style>

        <div className="pd-wrap">
          <div className="pd-container">
            جاري التحميل...
          </div>
        </div>
      </>
    );
  }

  return (
    <MainLayout>
      <>
        <style>{css}</style>

        <div className="pd-wrap">
          <div className="pd-container">

            <Link to="/" className="pd-back">
              ⬅ العودة للمتجر
            </Link>

            <div className="pd-card">

              {/* LEFT SIDE */}
              <div className="pd-gallery">

                <div
                  className="pd-img-container"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setZoomVisible(true)}
                  onMouseLeave={() => setZoomVisible(false)}
                >

                  {/* IMAGE */}
                  {selectedMedia.type === "image" && (
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
                        style={{
                          display: zoomVisible ? "block" : "none",
                        }}
                      />
                    </>
                  )}

                  {/* VIDEO */}
                  {selectedMedia.type === "video" && (
                    <video
                      src={selectedMedia.url}
                      controls
                      className="pd-main-video"
                    />
                  )}
                </div>

                {/* THUMBNAILS */}
                <div className="pd-thumbs">

                  {/* IMAGES */}
                  {product.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image.image_url}
                      alt=""
                      className={`pd-thumb ${
                        selectedMedia.type === "image" &&
                        selectedMedia.url === image.image_url
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedMedia({
                          type: "image",
                          url: image.image_url,
                        })
                      }
                    />
                  ))}

                  {/* VIDEO */}
                  {product.video_url && (
                    <div
                      className={`pd-video-thumb ${
                        selectedMedia.type === "video"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedMedia({
                          type: "video",
                          url: product.video_url,
                        })
                      }
                    >
                      <span>▶</span>
                    </div>
                  )}

                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="pd-info">

                <h1 className="pd-title">
                  {product.title}
                </h1>

                <p className="pd-price">
                  {product.price} DA
                </p>

                <div className="pd-specs">

                  {product.brand && (
                    <div className="pd-spec-item">
                      🏷️ {product.brand}
                    </div>
                  )}

                  {product.color && (
                    <div className="pd-spec-item">
                      🎨 {product.color}
                    </div>
                  )}

                  {product.size && (
                    <div className="pd-spec-item">
                      📏 {product.size}
                    </div>
                  )}

                </div>

                <p className="pd-description">
                  {product.description}
                </p>

                <a
                  href={`https://wa.me/${
                    product.whatsapp_number
                  }?text=${encodeURIComponent(
                    `مرحباً، أريد طلب هذا المنتج:

📌 المنتج: ${product.title}
💰 السعر: ${product.price} DA

🔗 الرابط:
${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pd-whatsapp"
                >
                  📞 تواصل عبر واتساب
                </a>

              </div>
            </div>
          </div>
        </div>
      </>
    </MainLayout>
  );
}