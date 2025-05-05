
import MovieRow from "@/components/ui/MovieRow";
import { ContentItem } from "@/hooks/useContentData";

interface ContentRowsProps {
  movieContent: ContentItem[];
  seriesContent: ContentItem[];
  midAd: any | null;
}

const ContentRows = ({ movieContent, seriesContent, midAd }: ContentRowsProps) => {
  return (
    <>
      {/* Movie row sliders */}
      {movieContent.length > 0 && (
        <MovieRow 
          title="Popular Movies" 
          movies={movieContent.slice(0, 8).map(item => ({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            type: "movie"
          }))}
          viewAllLink="/movies"
        />
      )}
      
      {/* Middle ad placement */}
      {midAd && (
        <div className="px-4 mt-4">
          <VideoAdBanner 
            key={midAd.id}
            ad={midAd}
          />
        </div>
      )}
      
      {/* Series row */}
      {seriesContent.length > 0 && (
        <MovieRow 
          title="Latest Series" 
          movies={seriesContent.slice(0, 8).map(item => ({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            type: "series"
          }))}
          viewAllLink="/series"
        />
      )}
    </>
  );
};

export default ContentRows;
