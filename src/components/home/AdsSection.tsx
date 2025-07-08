
import YouTubeStyleVideoAd from "@/components/home/YouTubeStyleVideoAd";
import BannerAdSpace from "@/components/home/BannerAdSpace";
import AutoPlayAdSequencer from "@/components/home/AutoPlayAdSequencer";

interface AdsSectionProps {
  videoAds: Array<{
    id: string;
    title: string;
    description?: string;
    video_url: string;
    thumbnail_url?: string;
    cta_text?: string;
    cta_url?: string;
    [key: string]: any;
  }>;
  bannerAds: Array<{
    id: string;
    title: string;
    description?: string;
    image_url: string;
    cta_text?: string;
    cta_url?: string;
    background_color?: string;
  }>;
}

const AdsSection = ({ videoAds, bannerAds }: AdsSectionProps) => {
  return (
    <div className="w-full max-w-none">
      {/* Auto-Playing Video Ad Sequencer */}
      {videoAds.length > 0 && (
        <AutoPlayAdSequencer 
          ads={videoAds}
          autoPlayDuration={15}
          onAdComplete={(adId) => {
            console.log('Auto-play ad completed:', adId);
          }}
        />
      )}

      {/* Organized Video Ads Section */}
      {videoAds.length > 0 && (
        <div className="w-full px-4 sm:px-6 mb-12">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">🎬 Featured Videos</h2>
            <p className="text-gray-400 text-sm">Sponsored content you might enjoy</p>
          </div>
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur-xl" />
            <div className="relative backdrop-blur-sm bg-black/10 rounded-2xl border border-white/5 p-4 sm:p-6 shadow-2xl w-full">
              <YouTubeStyleVideoAd 
                ads={videoAds}
                onAdComplete={(adId) => {
                  console.log('Video ad completed:', adId);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Banner Ads Section with Auto-Scroll */}
      {bannerAds.length > 0 && (
        <div className="w-full px-4 sm:px-6 mb-12">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">📢 Sponsored</h2>
          </div>
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent rounded-2xl blur-xl" />
            <BannerAdSpace 
              ads={bannerAds}
              autoSlideInterval={5000}
              showNavigation={true}
              className="relative backdrop-blur-sm bg-black/10 rounded-2xl border border-white/5 p-4 shadow-2xl w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsSection;
