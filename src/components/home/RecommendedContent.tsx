
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
  
  // Separate video ads and banner ads
  const actualVideoAds = videoAds?.filter(ad => 
    ad.video_url && ad.duration && ad.duration > 0
  ).map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    video_url: ad.video_url,
    thumbnail_url: ad.thumbnail_url,
    cta_text: ad.cta_text,
    cta_url: ad.cta_url,
    duration: ad.duration
  })) || [];

  const bannerAds = videoAds?.filter(ad => 
    ad.thumbnail_url && (!ad.duration || ad.duration === 0)
  ).map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    image_url: ad.thumbnail_url || '',
    cta_text: ad.cta_text || undefined,
    cta_url: ad.cta_url || undefined,
    background_color: 'from-purple-900/20 to-blue-900/20'
  })) || [];
  
  return (
    <div className="px-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
      
      {/* Ad Sequencer */}
      {(actualVideoAds.length > 0 || bannerAds.length > 0) && (
        <AdSequencer
          videoAds={actualVideoAds}
          bannerAds={bannerAds}
          onAdComplete={(adId) => {
            console.log('Ad completed:', adId);
          }}
        />
      )}
      
      {/* YouTube-style scrolling video list */}
      <ScrollArea className="h-[calc(100vh-500px)] pt-2">
        <div className="space-y-4">
          {videosList.slice(1).map((item) => (
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
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecommendedContent;
