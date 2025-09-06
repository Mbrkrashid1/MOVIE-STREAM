import { Search, Mic, Video, Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const YouTubeNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left side - Menu + Logo */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-6 h-6 text-gray-700" />
          </SidebarTrigger>
          
          <Link to="/" className="flex items-center gap-1">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HausaBox</span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex items-center max-w-2xl flex-1 mx-8">
          <div className="flex items-center w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button className="px-6 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
          
          <Button className="ml-2 p-2 hover:bg-gray-100 rounded-full">
            <Mic className="w-5 h-5 text-gray-700" />
          </Button>
        </div>

        {/* Right side - Create, Notifications, Profile */}
        <div className="flex items-center gap-2">
          {user && (
            <Link to="/creator">
              <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full">
                <Video className="w-6 h-6 text-gray-700" />
              </Button>
            </Link>
          )}
          
          <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>

          <Link to="/profile">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default YouTubeNavbar;