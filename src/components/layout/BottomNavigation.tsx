
import { Link, useLocation } from "react-router-dom";
import { Home, Library, Download, User } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-gray-800">
      <div className="flex justify-around items-center py-3">
        <Link to="/" className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span className="mt-1">Home</span>
        </Link>
        <Link to="/library" className={`nav-item ${currentPath.startsWith('/library') ? 'active' : ''}`}>
          <Library size={20} />
          <span className="mt-1">Library</span>
        </Link>
        <Link to="/downloads" className={`nav-item ${currentPath.startsWith('/downloads') ? 'active' : ''}`}>
          <Download size={20} />
          <span className="mt-1">Download</span>
        </Link>
        <Link to="/profile" className={`nav-item ${currentPath.startsWith('/profile') ? 'active' : ''}`}>
          <User size={20} />
          <span className="mt-1">Me</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
