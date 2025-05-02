
import { Link } from "react-router-dom";
import { Search, Menu, Bell } from "lucide-react";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white">
            <Menu size={20} />
          </button>
          <Link to="/" className="text-xl font-bold text-white flex items-center">
            Kanny<span className="text-kannyflix-green">Flix</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/search" className="text-gray-300 hover:text-white">
            <Search size={20} />
          </Link>
          <Link to="/notifications" className="text-gray-300 hover:text-white">
            <Bell size={20} />
          </Link>
          <Link to="/admin" className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              A
            </div>
          </Link>
        </div>
      </div>
      
      {/* Categories scrollable bar */}
      <div className="overflow-x-auto scrollbar-none bg-black/90">
        <div className="flex space-x-4 px-4 py-2 whitespace-nowrap">
          <button className="bg-gray-700 text-white px-3 py-1 text-sm rounded-full">All</button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 text-sm rounded-full">Hausa Movies</button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 text-sm rounded-full">Hausa Series</button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 text-sm rounded-full">Comedy</button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 text-sm rounded-full">Drama</button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 text-sm rounded-full">Action</button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 text-sm rounded-full">Kannywood</button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 text-sm rounded-full">Music</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
