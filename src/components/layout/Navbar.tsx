
import { Link } from "react-router-dom";
import { Search, Settings } from "lucide-react";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-bold text-white flex items-center">
            Kanny<span className="text-kannyflix-green">Flix</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/search" className="text-gray-300 hover:text-white">
            <Search size={20} />
          </Link>
          <Link to="/admin" className="text-gray-300 hover:text-white">
            <Settings size={20} />
          </Link>
        </div>
      </div>
      
      {/* Categories scrollable bar */}
      <div className="overflow-x-auto scrollbar-none bg-black/90">
        <div className="flex space-x-4 px-4 py-2 whitespace-nowrap">
          <button className="category-active px-3 py-1 text-sm">All</button>
          <button className="text-gray-300 px-3 py-1 text-sm">Hausa Movies</button>
          <button className="text-gray-300 px-3 py-1 text-sm">Hausa Series</button>
          <button className="text-gray-300 px-3 py-1 text-sm">Comedy</button>
          <button className="text-gray-300 px-3 py-1 text-sm">Drama</button>
          <button className="text-gray-300 px-3 py-1 text-sm">Action</button>
          <button className="text-gray-300 px-3 py-1 text-sm">Kannywood</button>
          <button className="text-gray-300 px-3 py-1 text-sm">Music</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
