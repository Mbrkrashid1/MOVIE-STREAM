
import MovieBoxRow from "@/components/ui/MovieBoxRow";
import { transformToMovieBoxCard } from "@/utils/contentTransformers";
import { ContentItem } from "@/hooks/useContentData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp, Star, Clock } from "lucide-react";

interface ContentRowsSectionProps {
  movieContent: ContentItem[];
  seriesContent: ContentItem[];
  videosList: ContentItem[];
}

const ContentRowsSection = ({ movieContent, seriesContent, videosList }: ContentRowsSectionProps) => {
  const transformedMovies = transformToMovieBoxCard(movieContent);
  const transformedSeries = transformToMovieBoxCard(seriesContent);
  const transformedVideos = transformToMovieBoxCard(videosList);

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Play className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Library</h1>
            <p className="text-muted-foreground">Discover amazing movies, series, and exclusive content</p>
          </div>
        </div>
      </div>

      {/* Trending Content */}
      {transformedVideos.length > 0 && (
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Trending Now</CardTitle>
                <p className="text-sm text-muted-foreground">Most watched content this week</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                Hot
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <MovieBoxRow
              title=""
              items={transformedVideos.slice(0, 10)}
              priority={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Movies Section */}
      {transformedMovies.length > 0 && (
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Featured Movies</CardTitle>
                <p className="text-sm text-muted-foreground">Blockbuster films and critically acclaimed cinema</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                {transformedMovies.length} titles
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <MovieBoxRow
              title=""
              items={transformedMovies}
              priority={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Series Section */}
      {transformedSeries.length > 0 && (
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Binge-Worthy Series</CardTitle>
                <p className="text-sm text-muted-foreground">Captivating series and seasonal shows</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                {transformedSeries.length} series
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <MovieBoxRow
              title=""
              items={transformedSeries}
              priority={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Recently Added */}
      {transformedVideos.length > 0 && (
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                <Play className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Recently Added</CardTitle>
                <p className="text-sm text-muted-foreground">Fresh content added to our library</p>
              </div>
              <Badge variant="default" className="ml-auto">
                New
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <MovieBoxRow
              title=""
              items={transformedVideos.slice(0, 8)}
              priority={false}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentRowsSection;
