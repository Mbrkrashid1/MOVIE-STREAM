
import ContinuousVideoAd from "@/components/home/ContinuousVideoAd";
import ImageBannerAd from "@/components/home/ImageBannerAd";

interface AdsPlacementProps {
  videoAds: any[];
  imageAds: any[];
}

const AdsPlacement = ({ videoAds, imageAds }: AdsPlacementProps) => {
  return (
    <>
      {/* Premium Video Ad Section */}
      {videoAds.length > 0 && (
        <div className="px-3 mb-6">
          <ContinuousVideoAd ads={[videoAds[0]]} />
        </div>
      )}

      {/* Image Banner Ad */}
      {imageAds.length > 0 && (
        <div className="px-3 mb-6">
          <ImageBannerAd ad={imageAds[0]} />
        </div>
      )}

      {/* Mid-Section Video Ad */}
      {videoAds.length > 1 && (
        <div className="px-3 mb-6">
          <ContinuousVideoAd ads={[videoAds[1]]} />
        </div>
      )}

      {/* Second Image Banner Ad */}
      {imageAds.length > 1 && (
        <div className="px-3 mb-6">
          <ImageBannerAd ad={imageAds[1]} />
        </div>
      )}

      {/* Bottom Video Ad */}
      {videoAds.length > 2 && (
        <div className="px-3 mb-6">
          <ContinuousVideoAd ads={[videoAds[2]]} />
        </div>
      )}
    </>
  );
};

export default AdsPlacement;
