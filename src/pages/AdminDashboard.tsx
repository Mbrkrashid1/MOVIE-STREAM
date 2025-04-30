
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Film, 
  Upload, 
  BarChart3, 
  UserCog, 
  Settings, 
  Tv
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ContentManagement from "@/components/admin/ContentManagement";
import AdManagement from "@/components/admin/AdManagement";
import AdPlacements from "@/components/admin/AdPlacements";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("movies");

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Admin Header */}
      <div className="bg-black p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">
          Kanny<span className="text-kannyflix-green">Flix</span> Admin
        </h1>
        <Link to="/">
          <Button variant="outline" size="sm">Exit Admin</Button>
        </Link>
      </div>

      {/* Admin Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Admin Sidebar */}
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

        {/* Admin Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "movies" && <ContentManagement />}
          {activeTab === "ads" && <AdManagement />}
          {activeTab === "adPlacements" && <AdPlacements />}
          {(activeTab === "analytics" || activeTab === "users" || activeTab === "settings") && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  {activeTab === "analytics" 
                    ? "Analytics Dashboard" 
                    : activeTab === "users" 
                    ? "User Management" 
                    : "Settings"}
                </h2>
                <p className="text-gray-400">This section is under development</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
