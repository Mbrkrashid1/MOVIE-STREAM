
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ContentManagement from "@/components/admin/ContentManagement";
import AdManagement from "@/components/admin/AdManagement";
import AdPlacements from "@/components/admin/AdPlacements";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import UserManagement from "@/components/admin/UserManagement";
import SettingsPanel from "@/components/admin/SettingsPanel";
import AdStudio from "@/components/admin/AdStudio";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("movies");

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "movies":
        return <ContentManagement />;
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
        return <ContentManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminHeader />
      
      <div className="flex h-[calc(100vh-64px)]">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-y-auto p-6">
          {renderActiveTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
