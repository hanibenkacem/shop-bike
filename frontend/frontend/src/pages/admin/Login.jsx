import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "400px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ marginBottom: "25px", textAlign: "center" }}>
          تسجيل الدخول
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
        />

        {/* PASSWORD WRAPPER */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "15px",
              paddingLeft: "45px", // Space for the eye icon on the left
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              textAlign: "right" // Keeps Arabic typing natural
            }}
          />
          
          {/* EYE SYMBOL BUTTON */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              color: "#777",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0"
            }}
          >
            {/* Unicode Eye and Eye-with-slash symbols */}
            {showPassword ? "👁️‍🗨️" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "8px",
            background: "black",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}