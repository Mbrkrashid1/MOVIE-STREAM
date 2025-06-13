
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ContentManagement from "@/components/admin/ContentManagement";
import SeriesManagement from "@/components/admin/SeriesManagement";
import AdManagement from "@/components/admin/AdManagement";
import AdPlacements from "@/components/admin/AdPlacements";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import UserManagement from "@/components/admin/UserManagement";
import SettingsPanel from "@/components/admin/SettingsPanel";
import AdStudio from "@/components/admin/AdStudio";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AnalyticsDashboard />;
      case "movies":
        return <ContentManagement />;
      case "series":
        return <SeriesManagement />;
      case "ads":
        return <AdManagement />;
      case "adPlacements":
        return <AdPlacements />;
      case "adStudio":
        return <AdStudio />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminHeader 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex h-[calc(100vh-64px)] relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          mt-16 lg:mt-0
        `}>
          <AdminSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {renderActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
