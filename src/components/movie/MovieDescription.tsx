
interface MovieDescriptionProps {
  movie: any;
}

export function MovieDescription({ movie }: MovieDescriptionProps) {
  return (
    <div className="px-6 mb-6">
      <h2 className="text-xl font-semibold mb-3">About this {movie.type}</h2>
      <p className="text-muted-foreground leading-relaxed">
        {movie.description || "No description available for this content."}
      </p>
    </div>
  );
}
