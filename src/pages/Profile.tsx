
import { Settings, List, Download, Clock, BookmarkCheck, HelpCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";

const ProfileItem = ({ icon, title, to }: { icon: React.ReactNode, title: string, to: string }) => (
  <Link to={to} className="flex items-center py-4 border-b border-gray-800">
    <div className="mr-4 text-gray-300">
      {icon}
    </div>
    <div className="flex-1">{title}</div>
    <div className="text-gray-500">›</div>
  </Link>
);

const Profile = () => {
  return (
    <div className="pb-24">
      <Navbar />
      
      <div className="mt-14 p-4">
        {/* Profile header */}
        <div className="flex items-center mb-8">
          <img 
            src="https://images.unsplash.com/photo-1500673922987-e212871fec22" 
            alt="Profile" 
            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-700"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold">Mbrkrashid</h2>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">Free user</span>
              <Link
                to="/vip"
                className="ml-2 inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-600 to-amber-500 rounded-full text-xs font-medium text-white"
              >
                <span className="mr-1">›</span>
                Upgrade to VIP
              </Link>
            </div>
          </div>
        </div>
        
        {/* VIP banner */}
        <div className="bg-gray-900 rounded-lg mb-8 p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div className="text-kannyflix-gold mr-2">💎</div>
              <span className="font-semibold">VIP</span>
              <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded">24% OFF</span>
            </div>
            <span className="text-gray-400">Nonactivated</span>
          </div>
          <div className="flex justify-end">
            <button className="bg-kannyflix-gold/20 text-kannyflix-gold px-3 py-1 rounded-md text-sm">
              Activate Now
            </button>
          </div>
        </div>
        
        {/* Watch History */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Watch History</h3>
          <div className="bg-gray-900 rounded-lg p-4">
            <Link to="/history" className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={20} className="text-gray-400 mr-3" />
                <span>Continue Watching</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>
            
            <div className="mt-4 flex space-x-3 overflow-x-auto scrollbar-none pb-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="min-w-[100px] w-[100px]">
                  <img 
                    src={`https://images.unsplash.com/photo-150067392298${item}-e212871fec22`} 
                    alt="Movie thumbnail" 
                    className="w-full h-[56px] object-cover rounded"
                  />
                  <p className="mt-1 text-xs text-gray-400 truncate">Movie {item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Content</h3>
          <div className="bg-gray-900 rounded-lg">
            <ProfileItem 
              icon={<BookmarkCheck size={20} />} 
              title="My List" 
              to="/my-list"
            />
            <ProfileItem 
              icon={<Download size={20} />} 
              title="Download" 
              to="/downloads"
            />
          </div>
        </div>
        
        {/* Preferences section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="bg-gray-900 rounded-lg">
            <ProfileItem 
              icon={<Settings size={20} />} 
              title="Settings" 
              to="/settings"
            />
            <ProfileItem 
              icon={<HelpCircle size={20} />} 
              title="Help" 
              to="/help"
            />
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
