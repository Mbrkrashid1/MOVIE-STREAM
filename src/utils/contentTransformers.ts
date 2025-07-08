
import { ContentItem, FeaturedItem } from "@/hooks/useContentData";

/**
 * Transforms content items to format required for MovieBoxCards
 */
export const transformToMovieBoxCard = (content: ContentItem[]) => {
  return content.map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1489599507557-6b9b2b1e8e8f",
    type: item.type as "movie" | "series",
    rating: Math.random() * 2 + 3.5,
    year: 2024,
    duration: item.duration || "2h 15m",
    genre: ["Action", "Drama", "Comedy", "Thriller", "Romance"][Math.floor(Math.random() * 5)],
    isNew: Math.random() > 0.6,
    video_url: item.video_url || "sample-video-url"
  }));
};

/**
 * Transforms featured items for hero section
 */
export const transformFeaturedForHero = (featuredItems: FeaturedItem[] | undefined) => {
  return featuredItems?.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || "Experience the finest Hausa cinema with stunning visuals, compelling storytelling, and unforgettable performances that capture the essence of our rich cultural heritage.",
    backgroundImage: item.backgroundImage,
    type: item.type,
    rating: 4.5,
    year: 2024,
    duration: "2h 30m",
    genre: "Drama",
    video_url: item.video_url || "sample-video-url"
  })) || [];
};

/**
 * Filter video ads that have valid video URLs
 */
export const filterVideoAds = (videoAds: any[] | undefined) => {
  return videoAds?.filter(ad => 
    ad.video_url && ad.video_url !== 'placeholder' && ad.video_url.trim() !== ''
  ) || [];
};

/**
 * Filter banner ads that have valid thumbnails but no valid video URLs
 */
export const filterBannerAds = (videoAds: any[] | undefined) => {
  return videoAds?.filter(ad => 
    ad.thumbnail_url && (!ad.video_url || ad.video_url === 'placeholder' || ad.video_url.trim() === '')
  ).map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    image_url: ad.thumbnail_url || '',
    cta_text: ad.cta_text || "Learn More",
    cta_url: ad.cta_url || "#",
    background_color: 'from-red-900/30 to-black/60'
  })) || [];
};
