import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if mobile on mount
    setIsMobile(window.innerWidth < 768);
    
    // Update on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video or Image */}
      {!isMobile ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          poster="/hero-poster.jpg"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support video.
        </video>
      ) : (
        // Static image on mobile to save data
        <img 
          src="/hero-poster.jpg" 
          alt="Taste of Aloha Background" 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content over video/image */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center">
          🌺 Taste of Aloha
        </h1>
        <p className="text-xl md:text-3xl mb-8 text-center max-w-2xl">
          Authentic Hawaiian Cuisine Delivered with Aloha Spirit
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/menu" 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg md:text-xl font-semibold transition-colors text-center text-white"
          >
            Order Now
          </Link>
          <Link 
            to="/about" 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-4 rounded-lg text-lg md:text-xl font-semibold transition-colors text-center border-2 border-white text-white"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;