import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  // not logged in
  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  // logged in
  return children;
}