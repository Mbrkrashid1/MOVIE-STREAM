import { useContentData } from "@/hooks/useContentData";
import YouTubeVideoCard from "@/components/ui/YouTubeVideoCard";
import LoadingScreen from "@/components/home/LoadingScreen";

const YouTubeHomeLayout = () => {
  const { videosList, isLoading } = useContentData();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Category filters */}
      <div className="sticky top-16 bg-white border-b border-gray-200 z-40">
        <div className="flex gap-3 px-6 py-3 overflow-x-auto">
          {[
            "All", "Movies", "Series", "Kannywood", "Hausa Music", 
            "Comedy", "Drama", "Action", "Romance", "Documentary"
          ].map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                category === "All"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8">
          {videosList?.map((video) => (
            <YouTubeVideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouTubeHomeLayout;