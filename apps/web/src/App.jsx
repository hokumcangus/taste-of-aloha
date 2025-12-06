import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';

function App() {
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
            <Link to="/about" className="hover:text-blue-600">
              About
            </Link>
          </div>
        </nav>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
