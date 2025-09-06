import { Users } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Community</h1>
        
        <div className="bg-white rounded-2xl p-6 text-center">
          <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Community Features</h2>
          <p className="text-gray-600">Connect with other creators and viewers in your community.</p>
        </div>
      </div>
    </div>
  );
};

export default Community;