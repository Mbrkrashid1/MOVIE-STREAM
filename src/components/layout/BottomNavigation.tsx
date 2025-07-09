
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Video, Library, User, MessageCircle } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/shorts', icon: Video, label: 'Shorts' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/profile', icon: User, label: 'You' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-black/90 backdrop-blur-lg border-t border-gray-800/50 shadow-2xl">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || 
            (item.path !== '/' && currentPath.startsWith(item.path));
          
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                isActive 
                  ? 'bg-primary/20 text-primary scale-105 shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10 hover:scale-105'
              }`}
            >
              <Icon size={22} className={`mb-1 ${isActive ? 'drop-shadow-glow' : ''}`} />
              <span className={`text-xs font-medium ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
