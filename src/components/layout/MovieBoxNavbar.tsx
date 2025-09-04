
import { Search, Bell, Menu, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const MovieBoxNavbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-streaming-darker/95 backdrop-blur-sm border-b border-streaming-border/30">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold text-gradient">
            HausaBox
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        {!isSearchOpen && (
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, series, documentaries..."
                className="w-full bg-streaming-card/60 backdrop-blur-sm rounded-2xl py-3 px-4 pl-12 text-sm text-streaming-text placeholder-streaming-muted border border-streaming-border/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
              />
              <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-streaming-muted" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gradient-primary text-white text-xs font-medium rounded-lg cursor-pointer hover:shadow-glow transition-all duration-200">
                Search
              </div>
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
                className="w-full bg-streaming-card/60 rounded-2xl py-3 px-4 pl-12 text-sm text-streaming-text placeholder-streaming-muted border border-streaming-border/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
              <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-streaming-muted" />
            </div>
          </div>
        )}

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {user && (
            <Button
              variant="ghost"
              className="hidden md:flex items-center gap-2 text-streaming-text hover:bg-streaming-card"
              onClick={() => navigate('/creator')}
            >
              <Video className="w-4 h-4" />
              Creator Studio
            </Button>
          )}
          
          {/* Mobile Search Toggle */}
          <button 
            className="md:hidden p-2 hover:bg-streaming-card/30 rounded-full transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} className="text-streaming-muted hover:text-primary transition-colors" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-streaming-card/30 rounded-full transition-colors">
            <Bell size={20} className="text-streaming-muted hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-glow">
              3
            </span>
          </button>

          {/* Menu */}
          <Link to="/profile">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:shadow-glow transition-all duration-200">
              <Menu size={16} className="text-white" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieBoxNavbar;
