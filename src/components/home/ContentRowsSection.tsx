
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import { ContentItem } from "@/hooks/useContentData";
import { transformToMovieBoxCard } from "@/utils/contentTransformers";

interface ContentRowsSectionProps {
  movieContent: ContentItem[];
  seriesContent: ContentItem[];
  videosList: ContentItem[] | undefined;
}

const ContentRowsSection = ({ movieContent, seriesContent, videosList }: ContentRowsSectionProps) => {
  return (
    <div className="w-full max-w-none space-y-12 pb-32">
      {/* Trending Now - Premium Showcase */}
      {movieContent.length > 0 && (
        <div className="w-full">
          <MovieBoxRow
            title="🔥 Trending Now"
            movies={transformToMovieBoxCard(movieContent.slice(0, 15))}
            viewAllLink="/movies"
            priority={true}
          />
        </div>
      )}

      {/* New & Popular - Fresh Content */}
      {seriesContent.length > 0 && (
        <div className="w-full">
          <MovieBoxRow
            title="🆕 New & Popular"
            movies={transformToMovieBoxCard(seriesContent.slice(0, 15))}
            viewAllLink="/series"
          />
        </div>
      )}

      {/* Continue Watching - Personalized */}
      {videosList && videosList.length > 6 && (
        <div className="w-full">
          <MovieBoxRow
            title="▶️ Continue Watching"
            movies={transformToMovieBoxCard(videosList.slice(0, 12))}
            viewAllLink="/continue"
          />
        </div>
      )}

      {/* Premium Originals */}
      {movieContent.length > 12 && (
        <div className="w-full">
          <MovieBoxRow
            title="⭐ HausaBox Originals"
            movies={transformToMovieBoxCard(movieContent.slice(12, 27))}
            viewAllLink="/originals"
          />
        </div>
      )}

      {/* Kannywood Classics */}
      {movieContent.length > 18 && (
        <div className="w-full">
          <MovieBoxRow
            title="🎭 Kannywood Classics"
            movies={transformToMovieBoxCard(movieContent.slice(18, 33))}
            viewAllLink="/classics"
          />
        </div>
      )}

      {/* Action & Adventure */}
      {movieContent.length > 24 && (
        <div className="w-full">
          <MovieBoxRow
            title="💥 Action & Adventure"
            movies={transformToMovieBoxCard(movieContent.slice(24, 39))}
            viewAllLink="/action"
          />
        </div>
      )}

      {/* Romance & Drama */}
      {seriesContent.length > 12 && (
        <div className="w-full">
          <MovieBoxRow
            title="💝 Romance & Drama"
            movies={transformToMovieBoxCard(seriesContent.slice(12, 27))}
            viewAllLink="/romance"
          />
        </div>
      )}

      {/* Comedy Central */}
      {videosList && videosList.length > 18 && (
        <div className="w-full">
          <MovieBoxRow
            title="😂 Comedy Central"
            movies={transformToMovieBoxCard(videosList.slice(18, 33))}
            viewAllLink="/comedy"
          />
        </div>
      )}

      {/* Family Entertainment */}
      {movieContent.length > 30 && (
        <div className="w-full">
          <MovieBoxRow
            title="👨‍👩‍👧‍👦 Family Entertainment"
            movies={transformToMovieBoxCard(movieContent.slice(30, 45))}
            viewAllLink="/family"
          />
        </div>
      )}
    </div>
  );
};

export default ContentRowsSection;
