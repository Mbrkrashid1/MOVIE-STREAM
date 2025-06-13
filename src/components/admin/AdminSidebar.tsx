
import { 
  Film, 
  Upload, 
  BarChart3, 
  UserCog, 
  Settings, 
  Tv,
  LayoutDashboard,
  Megaphone
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSidebarOpen?: (open: boolean) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab, setSidebarOpen }: AdminSidebarProps) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (setSidebarOpen) {
      setSidebarOpen(false); // Close sidebar on mobile after selection
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "movies", label: "Content Library", icon: Film },
    { id: "adStudio", label: "Ad Studio", icon: Megaphone },
    { id: "ads", label: "Ad Management", icon: Tv },
    { id: "adPlacements", label: "Ad Placements", icon: Upload },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "users", label: "User Management", icon: UserCog },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 lg:w-72 bg-zinc-900 border-r border-gray-800 h-full overflow-y-auto">
      <div className="flex flex-col p-4 space-y-2">
        <div className="mb-4 lg:hidden">
          <h2 className="text-lg font-semibold text-white mb-2">Admin Panel</h2>
        </div>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`
              flex items-center px-3 py-3 lg:py-2 rounded-md text-left w-full
              transition-colors duration-200
              ${activeTab === item.id 
                ? "bg-kannyflix-green text-black font-medium" 
                : "text-gray-300 hover:bg-zinc-800 hover:text-white"
              }
            `}
            onClick={() => handleTabClick(item.id)}
          >
            <item.icon className="mr-3 flex-shrink-0" size={20} />
            <span className="text-sm lg:text-base">{item.label}</span>
          </button>
        ))}
        
        {/* Mobile Footer */}
        <div className="lg:hidden mt-8 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            KannyFlix Admin v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
