
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentItem } from "@/hooks/useContentData";
import VideoCard from "@/components/ui/VideoCard";
import AdSequencer from "@/components/home/AdSequencer";

interface RecommendedContentProps {
  videosList: ContentItem[] | undefined;
  videoAds: any[] | undefined;
}

const RecommendedContent = ({ videosList, videoAds }: RecommendedContentProps) => {
  if (!videosList || !videosList.length) return null;
  
  return (
    <div className="px-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
      
      {/* YouTube-style scrolling video list */}
      <ScrollArea className="h-[calc(100vh-500px)] pt-2">
        <div className="space-y-4">
          {videosList && videoAds && (
            <AdSequencer
              videosList={videosList.slice(1)}
              videoAds={videoAds}
              renderItem={(item) => (
                <VideoCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail}
                  channelName={item.channelName}
                  views={item.views}
                  timeAgo={item.timeAgo}
                  duration={item.duration}
                  type={item.type as "movie" | "series"}
                />
              )}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecommendedContent;
