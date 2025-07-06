
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, MessageSquare, User, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold hidden sm:block">HausaBox</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-300 transition-colors">
              Home
            </Link>
            <Link to="/shorts" className="hover:text-green-300 transition-colors">
              Shorts
            </Link>
            <Link to="/library" className="hover:text-green-300 transition-colors">
              Library
            </Link>
            {user && (
              <Link to="/chat" className="hover:text-green-300 transition-colors flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search movies, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-green-700 border-green-600 text-white placeholder-green-300 focus:border-green-500"
              />
              <Button 
                type="submit"
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-500 h-8"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/profile')}
                  className="text-white hover:text-green-300 hover:bg-green-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="border-green-600 text-white hover:bg-green-700"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-green-600 hover:bg-green-500"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-green-300 hover:bg-green-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-green-700 border-t border-green-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-green-600 border-green-500 text-white placeholder-green-300"
                  />
                  <Button 
                    type="submit"
                    size="sm" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-400 h-8"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              <Link
                to="/"
                className="block px-3 py-2 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shorts"
                className="block px-3 py-2 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shorts
              </Link>
              <Link
                to="/library"
                className="block px-3 py-2 hover:bg-green-600 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Library
              </Link>
              {user && (
                <Link
                  to="/chat"
                  className="block px-3 py-2 hover:bg-green-600 rounded-md transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
