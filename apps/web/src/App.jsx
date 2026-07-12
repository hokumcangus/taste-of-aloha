import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { logout } from "./store/slices/authSlice";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

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
                <Link to="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="ml-auto rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="ml-auto hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-600">
                  Register
                </Link>
              </>
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
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
