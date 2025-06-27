
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import { MovieBoxCardProps } from "@/components/ui/MovieBoxCard";
import Card3DEffect from "@/components/home/Card3DEffect";

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
    <div className="space-y-8 relative">
      {/* Trending Section with 3D enhancements */}
      {trending.length > 0 && (
        <Card3DEffect className="relative">
          <div className="absolute -top-4 -left-4 w-28 h-28 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-tl from-accent/15 to-primary/15 rounded-full blur-xl"></div>
          <MovieBoxRow 
            title="🔥 Trending Now" 
            movies={trending.slice(0, 12)}
            priority={true}
          />
        </Card3DEffect>
      )}

      {/* Popular Movies with 3D depth */}
      {transformedMovies.length > 0 && (
        <Card3DEffect className="relative">
          <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-r from-primary/25 to-transparent rounded-full blur-xl transform -translate-y-1/2"></div>
          <MovieBoxRow 
            title="🎬 Popular Movies" 
            movies={transformedMovies.slice(0, 10)}
            viewAllLink="/movies"
          />
        </Card3DEffect>
      )}

      {/* Recently Added with floating effect */}
      {recentlyAdded.length > 0 && (
        <Card3DEffect className="relative">
          <div className="absolute -top-3 -right-3 w-32 h-32 bg-gradient-to-bl from-accent/18 to-primary/18 rounded-full blur-2xl animate-spin-slow"></div>
          <MovieBoxRow 
            title="✨ Fresh Uploads" 
            movies={recentlyAdded}
          />
        </Card3DEffect>
      )}

      {/* Kannywood Series with 3D glow */}
      {transformedSeries.length > 0 && (
        <Card3DEffect className="relative">
          <div className="absolute top-1/2 right-0 w-28 h-28 bg-gradient-to-l from-accent/22 to-transparent rounded-full blur-xl transform -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-lg"></div>
          <MovieBoxRow 
            title="📺 Kannywood Series" 
            movies={transformedSeries.slice(0, 10)}
            viewAllLink="/series"
          />
        </Card3DEffect>
      )}
    </div>
  );
};

export default ContentRowsSection;
