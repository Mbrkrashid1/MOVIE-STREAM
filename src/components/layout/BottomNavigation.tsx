
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Video, Library, User } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
      <div className="flex justify-around items-center py-2">
        <Link to="/" className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span className="mt-1 text-xs">Home</span>
        </Link>
        <Link to="/shorts" className={`nav-item ${currentPath.startsWith('/shorts') ? 'active' : ''}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z" />
          </svg>
          <span className="mt-1 text-xs">Shorts</span>
        </Link>
        <Link to="/library" className={`nav-item ${currentPath.startsWith('/library') ? 'active' : ''}`}>
          <Library size={20} />
          <span className="mt-1 text-xs">Library</span>
        </Link>
        <Link to="/profile" className={`nav-item ${currentPath.startsWith('/profile') ? 'active' : ''}`}>
          <User size={20} />
          <span className="mt-1 text-xs">You</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
