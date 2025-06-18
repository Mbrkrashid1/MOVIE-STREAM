
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import { MovieBoxCardProps } from "@/components/ui/MovieBoxCard";

interface ContentRowsSectionProps {
  movieContent: any[];
  seriesContent: any[];
}

const ContentRowsSection = ({ movieContent, seriesContent }: ContentRowsSectionProps) => {
  const transformedMovies = movieContent.map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail,
    type: "movie" as const,
    rating: 7.0 + Math.random() * 2.5,
    year: 2018 + Math.floor(Math.random() * 6),
    duration: item.duration,
    genre: "Drama",
    isNew: Math.random() > 0.7
  }));

  const transformedSeries = seriesContent.map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail,
    type: "series" as const,
    rating: 7.5 + Math.random() * 2.0,
    year: 2019 + Math.floor(Math.random() * 5),
    duration: "45m",
    genre: "Drama",
    isNew: Math.random() > 0.6
  }));

  const recentlyAdded = [...transformedMovies, ...transformedSeries]
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);

  const trending = [...transformedMovies, ...transformedSeries]
    .sort(() => 0.5 - Math.random())
    .slice(0, 15);

  return (
    <div className="space-y-6">
      {/* Trending Section with Compact Layout */}
      {trending.length > 0 && (
        <div className="relative">
          <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-2xl"></div>
          <MovieBoxRow 
            title="🔥 Trending Now" 
            movies={trending.slice(0, 12)}
            priority={true}
          />
        </div>
      )}

      {/* Popular Movies - Compact Grid */}
      {transformedMovies.length > 0 && (
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-20 h-20 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-xl"></div>
          <MovieBoxRow 
            title="🎬 Popular Movies" 
            movies={transformedMovies.slice(0, 10)}
            viewAllLink="/movies"
          />
        </div>
      )}

      {/* Recently Added - Smaller Cards */}
      {recentlyAdded.length > 0 && (
        <div className="relative">
          <div className="absolute -top-2 -right-2 w-28 h-28 bg-gradient-to-bl from-accent/12 to-primary/12 rounded-full blur-2xl"></div>
          <MovieBoxRow 
            title="✨ Fresh Uploads" 
            movies={recentlyAdded}
          />
        </div>
      )}

      {/* Kannywood Series */}
      {transformedSeries.length > 0 && (
        <div className="relative">
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-gradient-to-l from-accent/18 to-transparent rounded-full blur-xl"></div>
          <MovieBoxRow 
            title="📺 Kannywood Series" 
            movies={transformedSeries.slice(0, 10)}
            viewAllLink="/series"
          />
        </div>
      )}
    </div>
  );
};

export default ContentRowsSection;
