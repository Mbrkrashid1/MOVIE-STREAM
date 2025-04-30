
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ContentManagement from "@/components/admin/ContentManagement";
import AdManagement from "@/components/admin/AdManagement";
import AdPlacements from "@/components/admin/AdPlacements";
import PlaceholderTab from "@/components/admin/PlaceholderTab";

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
      case "analytics":
        return <PlaceholderTab title="Analytics Dashboard" />;
      case "users":
        return <PlaceholderTab title="User Management" />;
      case "settings":
        return <PlaceholderTab title="Settings" />;
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
