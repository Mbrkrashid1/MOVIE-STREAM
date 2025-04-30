
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Film, 
  Upload, 
  BarChart3, 
  UserCog, 
  Settings, 
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
              className={`flex items-center px-3 py-2 rounded-md mb-1 ${activeTab === "uploads" ? "bg-zinc-800 text-kannyflix-green" : "text-gray-400 hover:bg-zinc-800"}`}
              onClick={() => setActiveTab("uploads")}
            >
              <Upload className="mr-3" size={18} />
              <span>Upload Manager</span>
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
        <div className="flex-1 overflow-y-auto">
          {activeTab === "movies" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Content Library</h2>
                <Button className="bg-kannyflix-green hover:bg-kannyflix-green/90">
                  <Plus size={18} className="mr-2" /> Add New Content
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-zinc-900 rounded-lg overflow-hidden border border-gray-800">
                    <div className="aspect-video relative">
                      <img 
                        src={`https://images.unsplash.com/photo-${1500000000000 + item * 1000}-abcdef`} 
                        alt={`Hausa Movie ${item}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 text-xs rounded">
                        {Math.floor(Math.random() * 120) + 30}min
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-medium">Hausa Movie Title {item}</h3>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <span>{Math.floor(Math.random() * 100000) + 1000} views</span>
                        <span>{["Hausa", "Drama", "Comedy"][item % 3]}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="text-xs px-2">Edit</Button>
                        <Button size="sm" variant="outline" className="text-xs px-2 text-red-500">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "uploads" && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Upload Manager</h2>
              <div className="bg-zinc-900 rounded-lg p-6 border border-gray-800">
                <div className="text-center py-10">
                  <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">Upload New Content</h3>
                  <p className="text-gray-400 mb-4">Drag and drop files here or click to browse</p>
                  <Button className="bg-kannyflix-green hover:bg-kannyflix-green/90">Select Files</Button>
                </div>
              </div>
              
              <h3 className="text-xl font-medium mt-8 mb-4">Recent Uploads</h3>
              <div className="bg-zinc-900 rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Size</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-800">
                      <td className="p-3">Hausa Comedy Episode 5</td>
                      <td className="p-3">Series</td>
                      <td className="p-3">1.2 GB</td>
                      <td className="p-3"><span className="bg-green-900/30 text-green-500 px-2 py-1 rounded-full text-xs">Complete</span></td>
                      <td className="p-3"><Button size="sm" variant="outline" className="text-xs">View</Button></td>
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="p-3">Kannywood Drama</td>
                      <td className="p-3">Movie</td>
                      <td className="p-3">850 MB</td>
                      <td className="p-3"><span className="bg-blue-900/30 text-blue-500 px-2 py-1 rounded-full text-xs">Processing</span></td>
                      <td className="p-3"><Button size="sm" variant="outline" className="text-xs">View</Button></td>
                    </tr>
                    <tr className="border-t border-gray-800">
                      <td className="p-3">Traditional Dance</td>
                      <td className="p-3">Short</td>
                      <td className="p-3">45 MB</td>
                      <td className="p-3"><span className="bg-red-900/30 text-red-500 px-2 py-1 rounded-full text-xs">Failed</span></td>
                      <td className="p-3"><Button size="sm" variant="outline" className="text-xs">Retry</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-900 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-gray-400 mb-1">Total Views</h3>
                  <p className="text-2xl font-bold">1.25M</p>
                  <span className="text-green-500 text-sm">↑ 12% from last month</span>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-gray-400 mb-1">Watch Time</h3>
                  <p className="text-2xl font-bold">85.2K hrs</p>
                  <span className="text-green-500 text-sm">↑ 8% from last month</span>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-gray-400 mb-1">Ad Revenue</h3>
                  <p className="text-2xl font-bold">₦530,250</p>
                  <span className="text-red-500 text-sm">↓ 3% from last month</span>
                </div>
              </div>
              
              <div className="bg-zinc-900 p-4 rounded-lg border border-gray-800 mb-6">
                <h3 className="text-lg font-medium mb-4">Performance Chart</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  [Analytics chart would appear here]
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium mb-4">Top Content</h3>
                  <ul>
                    <li className="flex justify-between py-2 border-b border-gray-800">
                      <span>Hausa Comedy Season 2</span>
                      <span className="text-gray-400">245K views</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-gray-800">
                      <span>Kannywood Romance Drama</span>
                      <span className="text-gray-400">183K views</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span>Best of Hausa Music</span>
                      <span className="text-gray-400">132K views</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
                  <ul>
                    <li className="flex justify-between py-2 border-b border-gray-800">
                      <span>Nigeria</span>
                      <span className="text-gray-400">64%</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-gray-800">
                      <span>Niger</span>
                      <span className="text-gray-400">15%</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span>Ghana</span>
                      <span className="text-gray-400">8%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "users" || activeTab === "settings") && (
            <div className="p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">{activeTab === "users" ? "User Management" : "Settings"}</h2>
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
