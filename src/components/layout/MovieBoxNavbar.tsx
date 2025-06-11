
import { Search, Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const MovieBoxNavbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            HausaBox
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        {!isSearchOpen && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Hausa movies, series..."
                className="w-full bg-muted rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="flex items-center flex-1 max-w-md mx-6 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search content..."
                className="w-full bg-muted rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} className="text-muted-foreground hover:text-primary transition-colors" />
          </button>

          {/* Notifications */}
          <button className="relative">
            <Bell size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Menu */}
          <Link to="/profile">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors">
              <Menu size={16} className="text-primary" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieBoxNavbar;
