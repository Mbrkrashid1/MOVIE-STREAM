
import YouTubeStyleVideoAd from "@/components/home/YouTubeStyleVideoAd";
import BannerAdSpace from "@/components/home/BannerAdSpace";
import AutoPlayAdSequencer from "@/components/home/AutoPlayAdSequencer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="w-full max-w-none space-y-8">
      {/* Auto-Playing Video Ad Sequencer */}
      {videoAds.length > 0 && (
        <div className="relative">
          <AutoPlayAdSequencer 
            ads={videoAds}
            autoPlayDuration={15}
            onAdComplete={(adId) => {
              console.log('Auto-play ad completed:', adId);
            }}
          />
        </div>
      )}

      {/* Featured Video Ads Section */}
      {videoAds.length > 0 && (
        <div className="w-full">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-2xl font-bold text-foreground">Featured Content</h2>
              <Badge variant="secondary" className="text-xs">
                Sponsored
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover premium content and exclusive offers from our partners
            </p>
          </div>
          
          <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
            <CardContent className="relative p-6">
              <YouTubeStyleVideoAd 
                ads={videoAds}
                onAdComplete={(adId) => {
                  console.log('Video ad completed:', adId);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Banner Ads Section */}
      {bannerAds.length > 0 && (
        <div className="w-full">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground">Partner Highlights</h2>
              <Badge variant="outline" className="text-xs">
                Sponsored
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Exclusive offers and partnerships
            </p>
          </div>
          
          <Card className="relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-muted/10" />
            <CardContent className="relative p-4">
              <BannerAdSpace 
                ads={bannerAds}
                autoSlideInterval={5000}
                showNavigation={true}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdsSection;
