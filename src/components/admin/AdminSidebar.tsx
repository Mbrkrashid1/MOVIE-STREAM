
import { useState } from "react";
import { 
  Film, 
  Upload, 
  BarChart3, 
  UserCog, 
  Settings, 
  Tv
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  return (
    <div className="w-64 bg-zinc-900 border-r border-gray-800">
      <div className="flex flex-col p-4">
        <button 
          className={`flex items-center px-3 py-2 rounded-md mb-1 ${activeTab === "movies" ? "bg-zinc-800 text-kannyflix-green" : "text-gray-400 hover:bg-zinc-800"}`}
          onClick={() => setActiveTab("movies")}
        >
          <Film className="mr-3" size={18} />
          <span>Content Library</span>
        </button>
        <button 
          className={`flex items-center px-3 py-2 rounded-md mb-1 ${activeTab === "ads" ? "bg-zinc-800 text-kannyflix-green" : "text-gray-400 hover:bg-zinc-800"}`}
          onClick={() => setActiveTab("ads")}
        >
          <Tv className="mr-3" size={18} />
          <span>Ads Management</span>
        </button>
        <button 
          className={`flex items-center px-3 py-2 rounded-md mb-1 ${activeTab === "adPlacements" ? "bg-zinc-800 text-kannyflix-green" : "text-gray-400 hover:bg-zinc-800"}`}
          onClick={() => setActiveTab("adPlacements")}
        >
          <Upload className="mr-3" size={18} />
          <span>Ad Placements</span>
        </button>
        <button 
          className={`flex items-center px-3 py-2 rounded-md mb-1 ${activeTab === "analytics" ? "bg-zinc-800 text-kannyflix-green" : "text-gray-400 hover:bg-zinc-800"}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 className="mr-3" size={18} />
          <span>Analytics</span>
        </button>
        <button 
          className={`flex items-center px-3 py-2 rounded-md mb-1 ${activeTab === "users" ? "bg-zinc-800 text-kannyflix-green" : "text-gray-400 hover:bg-zinc-800"}`}
          onClick={() => setActiveTab("users")}
        >
          <UserCog className="mr-3" size={18} />
          <span>User Management</span>
        </button>
        <button 
          className={`flex items-center px-3 py-2 rounded-md mb-1 ${activeTab === "settings" ? "bg-zinc-800 text-kannyflix-green" : "text-gray-400 hover:bg-zinc-800"}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-3" size={18} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
