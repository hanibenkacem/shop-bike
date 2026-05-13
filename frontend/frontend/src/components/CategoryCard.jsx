import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  const accentColor = "#D32F2F";
  const secondaryColor = "#006233";
  const hasImage = category.image && category.image !== "";

  return (
    <>
      <style>{`
        :root {
          --cat-accent: ${accentColor};
          --cat-secondary: ${secondaryColor};
        }

        .cat-card {
          text-decoration: none;
          color: inherit;
          display: block;
          direction: rtl;
          font-family: 'Tajawal', 'Noto Kufi Arabic', sans-serif;
          width: 100%;               /* always fill its parent */
          max-width: 420px;          /* prevent extreme stretching on desktop */
          margin: 0 auto;            /* center if parent grid leaves space */
        }

        .cat-card-inner {
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;               /* stretch to match grid row height */
        }

        .cat-card:hover .cat-card-inner {
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }

        .cat-card-accent {
          height: 5px;
          background: linear-gradient(to left,
            var(--cat-secondary), var(--cat-accent));
          flex-shrink: 0;
        }

        .cat-card-img-wrapper {
          width: 100%;
          aspect-ratio: 4 / 3;        /* responsive image container */
          overflow: hidden;
          flex-shrink: 0;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cat-card:hover .cat-card-img {
          transform: scale(1.05);
        }

        .cat-card-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f9f9f9, #e8e8e8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          color: var(--cat-secondary);
        }

        .cat-card-body {
          padding: 16px 20px;
          flex: 1;                    /* pushes the CTA to the bottom */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cat-card-name {
          font-size: clamp(1rem, 2.2vw, 1.3rem);
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .cat-card-browse {
          font-size: 0.9rem;
          color: var(--cat-accent);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: auto;
        }

        .cat-card-browse-arrow {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }

        .cat-card:hover .cat-card-browse-arrow {
          transform: translateX(-6px); /* leftwards in RTL */
        }

        /* Mobile padding tweaks */
        @media (max-width: 600px) {
          .cat-card-body {
            padding: 12px 14px;
          }
          .cat-card-name {
            font-size: 1rem;
          }
          .cat-card-browse {
            font-size: 0.85rem;
          }
        }
      `}</style>

      <Link
        to={`/category/${category.id}-${category.slug}`}
        className="cat-card"
      >
        <div className="cat-card-inner">
          <div className="cat-card-accent" />

          <div className="cat-card-img-wrapper">
            {hasImage ? (
              <img
                src={category.image}
                alt={category.name}
                className="cat-card-img"
                loading="lazy"
              />
            ) : (
              <div className="cat-card-placeholder">🛍️</div>
            )}
          </div>

          <div className="cat-card-body">
            <div className="cat-card-name">{category.name}</div>
            <div className="cat-card-browse">
              <span>تصفح المنتجات</span>
              <span className="cat-card-browse-arrow">←</span>
            </div>
          </div>
        </div>
      </Link>
      
    </>
  );
}