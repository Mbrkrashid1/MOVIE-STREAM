
import { Link } from "react-router-dom";
import { Search, Clock } from "lucide-react";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-kannyflix-header border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold text-white">
            Kanny<span className="text-kannyflix-green">Flix</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="category-active py-1">
              Home
            </Link>
            <Link to="/movies" className="text-gray-300 hover:text-white py-1">
              Movies
            </Link>
            <Link to="/series" className="text-gray-300 hover:text-white py-1">
              Series
            </Link>
            <Link to="/kannywood" className="text-gray-300 hover:text-white py-1">
              Kannywood
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white">
            <Search size={20} />
          </button>
          <button className="text-gray-300 hover:text-white md:hidden">
            <Clock size={20} />
          </button>
          <Link 
            to="/vip" 
            className="hidden md:flex items-center px-3 py-1 bg-gradient-to-r from-yellow-600 to-amber-500 rounded-full text-sm font-medium text-white"
          >
            Get VIP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
