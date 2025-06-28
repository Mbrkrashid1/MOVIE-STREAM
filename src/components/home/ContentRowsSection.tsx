
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import AdBannerSequencer from "./AdBannerSequencer";
import { useContentData } from "@/hooks/useContentData";

interface ContentRowsSectionProps {
  movieContent: any[];
  seriesContent: any[];
}

const ContentRowsSection = ({ movieContent, seriesContent }: ContentRowsSectionProps) => {
  const { videoAds } = useContentData();

  // Combine all content for the sequencer
  const allContent = [
    ...movieContent.slice(0, 8).map(item => ({ ...item, rowType: 'movie' })),
    ...seriesContent.slice(0, 8).map(item => ({ ...item, rowType: 'series' })),
    ...movieContent.slice(8).map(item => ({ ...item, rowType: 'movie' })),
    ...seriesContent.slice(8).map(item => ({ ...item, rowType: 'series' }))
  ];

  const renderContentItem = (item: any, index: number) => {
    if (item.rowType === 'movie') {
      return (
        <div key={`movie-${item.id}-${index}`} className="mb-8">
          <MovieBoxRow 
            title="Featured Movies" 
            items={movieContent.slice(index * 4, (index * 4) + 4)} 
          />
        </div>
      );
    } else if (item.rowType === 'series') {
      return (
        <div key={`series-${item.id}-${index}`} className="mb-8">
          <MovieBoxRow 
            title="Popular Series" 
            items={seriesContent.slice(index * 4, (index * 4) + 4)} 
          />
        </div>
      );
    }
    return null;
  };

  // Create simplified content array for proper sequencing
  const simplifiedContent = [
    { id: 'movies-1', type: 'movie-row', rowType: 'movie' },
    { id: 'series-1', type: 'series-row', rowType: 'series' },
    { id: 'movies-2', type: 'movie-row', rowType: 'movie' },
    { id: 'series-2', type: 'series-row', rowType: 'series' },
    { id: 'movies-3', type: 'movie-row', rowType: 'movie' },
    { id: 'series-3', type: 'series-row', rowType: 'series' },
  ];

  const renderSimplifiedItem = (item: any, index: number) => {
    if (item.rowType === 'movie' && movieContent.length > 0) {
      const startIndex = Math.floor(index / 2) * 6;
      const rowMovies = movieContent.slice(startIndex, startIndex + 6);
      if (rowMovies.length > 0) {
        return (
          <div key={`movie-row-${index}`} className="mb-8">
            <MovieBoxRow 
              title={`Featured Movies ${Math.floor(index / 2) + 1}`} 
              items={rowMovies} 
            />
          </div>
        );
      }
    } else if (item.rowType === 'series' && seriesContent.length > 0) {
      const startIndex = Math.floor(index / 2) * 6;
      const rowSeries = seriesContent.slice(startIndex, startIndex + 6);
      if (rowSeries.length > 0) {
        return (
          <div key={`series-row-${index}`} className="mb-8">
            <MovieBoxRow 
              title={`Popular Series ${Math.floor(index / 2) + 1}`} 
              items={rowSeries} 
            />
          </div>
        );
      }
    }
    return null;
  };

  const videoAdsList = videoAds?.filter(ad => ad.thumbnail_url) || [];

  return (
    <div className="space-y-8 px-4">
      <AdBannerSequencer
        content={simplifiedContent}
        ads={videoAdsList}
        renderItem={renderSimplifiedItem}
        adPlacement={{
          positions: [2, 5], // Place ad banners after 2nd and 5th content rows
          adsPerBanner: 4
        }}
      />
    </div>
  );
};

export default ContentRowsSection;
