import { Link } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

  .pc-link {
    display: block;
    text-decoration: none;
    color: inherit;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    height: 100%;
  }

  .pc-card {
    position: relative;
    background: #111111;
    border: 1px solid #222222;
    border-radius: 10px;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  }

  .pc-link:hover .pc-card {
    border-color: rgba(245, 66, 10, 0.55);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(245, 66, 10, 0.1) inset;
    transform: translateY(-5px);
  }

  /* top accent bar animates in on hover */
  .pc-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #F5420A, #FFB800);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
    z-index: 5;
  }

  .pc-link:hover .pc-card::before {
    transform: scaleX(1);
  }

  /* ── IMAGE ── */
  .pc-img-wrap {
    position: relative;
    overflow: hidden;
    background: #0d0d0d;
    aspect-ratio: 4 / 3;
    flex-shrink: 0;
  }

  .pc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease, filter 0.4s ease;
    filter: brightness(0.88) saturate(0.9);
  }

  .pc-link:hover .pc-img {
    transform: scale(1.07);
    filter: brightness(1) saturate(1.1);
  }

  /* dark gradient overlay on image */
  .pc-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(10, 10, 10, 0.85) 0%,
      rgba(10, 10, 10, 0.15) 50%,
      transparent 100%
    );
    z-index: 2;
  }

  /* category chip on image */
  .pc-chip {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    background: rgba(245, 66, 10, 0.92);
    color: white;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 3px;
    clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  }

  /* no image fallback */
  .pc-no-img {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #333;
  }

  .pc-no-img-icon { font-size: 3rem; opacity: 0.4; }
  .pc-no-img-text { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }

  /* ── BODY ── */
  .pc-body {
    padding: 18px 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }

  .pc-title {
    font-size: 1rem;
    font-weight: 800;
    color: #f0ede8;
    line-height: 1.4;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── SEPARATOR ── */
  .pc-sep {
    height: 1px;
    background: linear-gradient(90deg, #252525, transparent);
    margin: 2px 0;
  }

  /* ── FOOTER ROW ── */
  .pc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: auto;
  }

  .pc-price {
    display: flex;
    align-items: baseline;
    gap: 5px;
  }

  .pc-price-amount {
    font-size: 1.45rem;
    font-weight: 900;
    color: #F5420A;
    line-height: 1;
  }

  .pc-price-currency {
    font-size: 0.72rem;
    font-weight: 800;
    color: #6b6b6b;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  /* CTA arrow pill */
  .pc-cta {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b6b6b;
    font-size: 14px;
    flex-shrink: 0;
    transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s;
  }

  .pc-link:hover .pc-cta {
    background: #F5420A;
    border-color: #F5420A;
    color: white;
    transform: rotate(-45deg);
  }
`;

// inject styles once
if (typeof document !== "undefined" && !document.getElementById("pc-styles")) {
  const tag = document.createElement("style");
  tag.id = "pc-styles";
  tag.textContent = css;
  document.head.appendChild(tag);
}

export default function ProductCard({ product }) {
  console.log("Product Data:", product); // <--- Check this in the browser console
  const formattedPrice = Number(product.price).toLocaleString("fr-DZ");
  const mainImageObject = product.images?.[0];
  const mainImageUrl = mainImageObject?.image_url;
  return (
    <Link to={`/product/${product.id}`} className="pc-link">
      <div className="pc-card">

        {/* ── IMAGE ── */}
        <div className="pc-img-wrap">
          {mainImageUrl ? ( // Use our extracted URL here
            <>
              <img
                src={mainImageUrl} // Changed from product.images[0]
                alt={product.title}
                className="pc-img"
                loading="lazy"
              />
              <div className="pc-img-overlay" />
              {(product.category_name || product.category?.name) && (
                <span className="pc-chip">
                  {product.category_name || product.category.name}
                </span>
              )}
            </>
          ) : (
            <div className="pc-no-img">
              <span className="pc-no-img-icon">🏍️</span>
              <span className="pc-no-img-text">لا توجد صورة</span>
            </div>
          )}
        </div>

        {/* ── BODY ── */}
        <div className="pc-body">
          <h2 className="pc-title">{product.title}</h2>
          <div className="pc-sep" />
          <div className="pc-footer">
            <div className="pc-price">
              <span className="pc-price-amount">{formattedPrice}</span>
              <span className="pc-price-currency">DA</span>
            </div>
            <div className="pc-cta">↗</div>
          </div>
        </div>

      </div>
    </Link>
  );
}