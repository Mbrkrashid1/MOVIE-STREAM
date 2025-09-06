import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search</h1>
        
        <div className="bg-white rounded-2xl p-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for content..."
              className="w-full bg-gray-50 rounded-xl py-3 px-4 pl-12 text-gray-900 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;