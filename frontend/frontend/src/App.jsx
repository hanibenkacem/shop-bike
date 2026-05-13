import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/Home";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />
         <Route
          path="/category/:categorySlug"
          element={<CategoryProducts />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />
<Route
  path="/admin/login"
  element={<Login />}
/>

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>


      </Routes>

    </BrowserRouter>
  );
}