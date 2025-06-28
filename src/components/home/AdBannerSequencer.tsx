
import { ReactNode } from "react";
import AutoSlideAdBanner from "@/components/ui/AutoSlideAdBanner";

interface AdItem {
  id: string;
  isAdBanner: boolean;
  adData?: any[];
  position?: number;
}

interface ContentItem {
  id: string;
  type: string;
  [key: string]: any;
}

interface AdBannerSequencerProps {
  content: ContentItem[];
  ads: any[];
  renderItem: (item: ContentItem, index: number) => ReactNode;
  adPlacement?: {
    positions: number[]; // After which content items to place ads
    adsPerBanner?: number; // How many ads per banner
  };
}

const AdBannerSequencer = ({ 
  content, 
  ads, 
  renderItem,
  adPlacement = {
    positions: [3, 8, 15, 25], // Place ads after 3rd, 8th, 15th, 25th items
    adsPerBanner: 3
  }
}: AdBannerSequencerProps) => {
  
  const insertAdBanners = () => {
    if (!content || !ads || ads.length === 0) return content;

    const result = [];
    let adIndex = 0;
    const { positions, adsPerBanner = 3 } = adPlacement;

    for (let i = 0; i < content.length; i++) {
      // Add the content item
      result.push(content[i]);

      // Check if we should place an ad banner after this position
      if (positions.includes(i + 1) && adIndex < ads.length) {
        // Get ads for this banner
        const bannerAds = ads.slice(adIndex, adIndex + adsPerBanner);
        
        if (bannerAds.length > 0) {
          result.push({
            id: `ad-banner-${adIndex}`,
            isAdBanner: true,
            adData: bannerAds,
            position: i + 1
          });
          
          adIndex += adsPerBanner;
        }
      }
    }

    return result;
  };

  const contentWithAdBanners = insertAdBanners();
  
  return (
    <>
      {contentWithAdBanners.map((item, index) => 
        item.isAdBanner ? (
          <div key={`ad-banner-${index}`} className="my-8">
            <AutoSlideAdBanner 
              ads={item.adData}
              autoSlideInterval={6000}
              showControls={true}
            />
          </div>
        ) : (
          renderItem(item, index)
        )
      )}
    </>
  );
};

export default AdBannerSequencer;
