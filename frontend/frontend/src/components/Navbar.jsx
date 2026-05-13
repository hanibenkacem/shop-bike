import { Link } from "react-router-dom";

export default function Navbar() {
  const linkStyle = {
    textDecoration: "none",
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: "15px",
    fontFamily: "'Cairo', sans-serif",
    position: "relative",
    padding: "5px 0",
    transition: "color 0.3s ease",
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px clamp(12px, 4vw, 50px)",
                background: "rgba(255, 255, 255, 0.9)", // Translucent white
        backdropFilter: "blur(10px)", // Glass effect
        borderBottom: "3px solid #006233", // Strong Algerian Green base
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        direction: "rtl", 
        flexWrap: "wrap",
gap: "10px",
      }}
    >
      {/* 1. RIGHT SIDE: The Brand Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img
            src="/logo.png"
            alt="World Bike Logo"
            style={{
                width: "clamp(110px, 18vw, 160px)", 
              height: "auto",
              objectFit: "contain",
              transition: "transform 0.3s ease",
              filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.08))",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </Link>
      </div>

      {/* 2. LEFT SIDE: Elegant Navigation Links */}
      <div
  style={{
    display: "flex",
    gap: "clamp(10px, 2vw, 30px)",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end"
  }}
>
        <div className="nav-link-wrapper">
          <Link 
            to="/" 
            style={linkStyle}
            className="hover-underline"
          >
            الرئيسية
          </Link>
        </div>
        
        <div className="nav-link-wrapper">
          <Link 
            to="/admin/login" 
            style={{
                ...linkStyle,
                background: "#006233", // Administration as a subtle button
                color: "white",
                padding: "8px 16px",
                borderRadius: "50px",
                fontSize: "14px"
            }}
            onMouseOver={(e) => e.target.style.background = "#D4AF37"} // Changes to Gold on hover
            onMouseOut={(e) => e.target.style.background = "#006233"}
          >
            بوابة الإدارة
          </Link>
        </div>
      </div>

      {/* Embedded CSS for the link hover effect */}
      <style>{`
        .hover-underline::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: #006233;
          transition: all 0.3s ease-in-out;
          transform: translateX(-50%);
        }
        .hover-underline:hover::after {
          width: 100%;
        }
        .hover-underline:hover {
          color: #006233 !important;
        }
          @media (max-width: 600px) {
  nav {
    justify-content: center !important;
  }
}
      `}</style>
    </nav>
  );
}