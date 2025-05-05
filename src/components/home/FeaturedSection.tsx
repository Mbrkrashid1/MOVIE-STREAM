
import FeaturedSlider from "@/components/ui/FeaturedSlider";
import { FeaturedItem } from "@/hooks/useContentData";
import VideoAdBanner from "@/components/ui/VideoAdBanner";

interface FeaturedSectionProps {
  featuredItems: FeaturedItem[] | undefined;
  premiumAd: any | null;
}

const FeaturedSection = ({ featuredItems, premiumAd }: FeaturedSectionProps) => {
  return (
    <>
      {/* Featured hero slider */}
      {featuredItems && featuredItems.length > 0 && (
        <FeaturedSlider items={featuredItems} />
      )}
      
      {/* Premium ad slot (first position, full width) */}
      {premiumAd && (
        <div className="px-4 mt-4">
          <VideoAdBanner 
            key={premiumAd.id}
            ad={{...premiumAd, cta_text: "Learn More"}}
          />
        </div>
      )}
    </>
  );
};

export default FeaturedSection;
