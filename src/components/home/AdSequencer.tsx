
import { ReactNode } from "react";
import VideoAdBanner from "@/components/ui/VideoAdBanner";

interface AdItem {
  id: string;
  isAd: boolean;
  isPremium?: boolean;
  adData?: any;
}

interface ContentItem {
  id: string;
  type: string;
  [key: string]: any;
}

interface AdSequencerProps {
  videosList: ContentItem[];
  videoAds: any[];
  renderItem: (item: ContentItem, index: number) => ReactNode;
}

const AdSequencer = ({ videosList, videoAds, renderItem }: AdSequencerProps) => {
  // Insert ads in specific positions in the content
  const insertAdsInContent = () => {
    if (!videosList) return [];
    if (!videoAds || videoAds.length === 0) return videosList;

    // Group videos into segments of 4 for regular pattern
    const result = [];
    let adIndex = 0;

    // First premium ad position (after featured slider)
    if (videoAds.length > 0) {
      const premiumAd = videoAds[0];
      result.push({
        id: `premium-ad-${premiumAd.id}`,
        isAd: true,
        isPremium: true,
        adData: premiumAd
      });
    }

    // First batch of videos (4 videos)
    const firstBatch = videosList.slice(0, 4);
    firstBatch.forEach(video => result.push(video));

    // Mid-section standard ad
    if (videoAds.length > 1) {
      const midAd = videoAds[1];
      result.push({
        id: `mid-ad-${midAd.id}`,
        isAd: true,
        isPremium: false,
        adData: midAd
      });
    }

    // Remaining videos with ads every 6 videos
    for (let i = 4; i < videosList.length; i++) {
      result.push(videosList[i]);
      
      // Insert standard ad every 6 videos after the first section
      if ((i - 3) % 6 === 0 && adIndex + 2 < videoAds.length) {
        adIndex = (adIndex + 1) % (videoAds.length - 2);
        const ad = videoAds[adIndex + 2]; // Skip the first 2 premium ads
        result.push({
          id: `ad-${ad.id}`,
          isAd: true,
          isPremium: false,
          adData: ad
        });
      }
    }

    return result;
  };

  const contentWithAds = insertAdsInContent();
  
  return (
    <>
      {contentWithAds.map((item, index) => 
        item.isAd ? (
          <VideoAdBanner 
            key={`ad-${index}`}
            ad={item.adData}
          />
        ) : (
          renderItem(item, index)
        )
      )}
    </>
  );
};

export default AdSequencer;
