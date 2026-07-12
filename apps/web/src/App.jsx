import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import KitchenDashboard from "./pages/KitchenDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { logout } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const itemCount = useSelector((state) => state.cart.itemCount);
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
          <div className="container mx-auto flex gap-6 items-center">
            <Link to="/" className="font-bold text-xl hover:text-blue-600">
              🌺 Taste of Aloha
            </Link>
            <Link to="/menu" className="hover:text-blue-600">
              Menu
            </Link>
            <Link to="/checkout" className="hover:text-blue-600">
              Checkout ({itemCount})
            </Link>
            <Link to="/about" className="hover:text-blue-600">
              About
            </Link>
            {user ? (
              <>
                <Link
                  to={`/dashboard/${user.role.toLowerCase()}`}
                  className="hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <button
                  className="ml-auto text-sm text-red-600"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="ml-auto hover:text-blue-600">
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/kitchen"
            element={
              <ProtectedRoute roles={["KITCHEN"]}>
                <KitchenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/driver"
            element={
              <ProtectedRoute roles={["DRIVER"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
