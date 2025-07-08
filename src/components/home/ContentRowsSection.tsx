
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
    <div className="space-y-12 pb-32">
      {/* Trending Now - Premium Showcase */}
      {movieContent.length > 0 && (
        <MovieBoxRow
          title="🔥 Trending Now"
          movies={transformToMovieBoxCard(movieContent.slice(0, 15))}
          viewAllLink="/movies"
          priority={true}
        />
      )}

      {/* New & Popular - Fresh Content */}
      {seriesContent.length > 0 && (
        <MovieBoxRow
          title="🆕 New & Popular"
          movies={transformToMovieBoxCard(seriesContent.slice(0, 15))}
          viewAllLink="/series"
        />
      )}

      {/* Continue Watching - Personalized */}
      {videosList && videosList.length > 6 && (
        <MovieBoxRow
          title="▶️ Continue Watching"
          movies={transformToMovieBoxCard(videosList.slice(0, 12))}
          viewAllLink="/continue"
        />
      )}

      {/* Premium Originals */}
      {movieContent.length > 12 && (
        <MovieBoxRow
          title="⭐ HausaBox Originals"
          movies={transformToMovieBoxCard(movieContent.slice(12, 27))}
          viewAllLink="/originals"
        />
      )}

      {/* Kannywood Classics */}
      {movieContent.length > 18 && (
        <MovieBoxRow
          title="🎭 Kannywood Classics"
          movies={transformToMovieBoxCard(movieContent.slice(18, 33))}
          viewAllLink="/classics"
        />
      )}

      {/* Action & Adventure */}
      {movieContent.length > 24 && (
        <MovieBoxRow
          title="💥 Action & Adventure"
          movies={transformToMovieBoxCard(movieContent.slice(24, 39))}
          viewAllLink="/action"
        />
      )}

      {/* Romance & Drama */}
      {seriesContent.length > 12 && (
        <MovieBoxRow
          title="💝 Romance & Drama"
          movies={transformToMovieBoxCard(seriesContent.slice(12, 27))}
          viewAllLink="/romance"
        />
      )}

      {/* Comedy Central */}
      {videosList && videosList.length > 18 && (
        <MovieBoxRow
          title="😂 Comedy Central"
          movies={transformToMovieBoxCard(videosList.slice(18, 33))}
          viewAllLink="/comedy"
        />
      )}

      {/* Family Entertainment */}
      {movieContent.length > 30 && (
        <MovieBoxRow
          title="👨‍👩‍👧‍👦 Family Entertainment"
          movies={transformToMovieBoxCard(movieContent.slice(30, 45))}
          viewAllLink="/family"
        />
      )}
    </div>
  );
};

export default ContentRowsSection;
