import { useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

// Title se unique gradient banata hai (same title = same gradient)
function getGradient(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(160deg, hsl(${h1} 45% 16%), hsl(${h2} 55% 10%) 60%, #0a0a0c)`;
}

export function FavoriteButton({ movie, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movie.imdbID);

  return (
    <button
      type="button"
      className={`fav-btn ${active ? "active" : ""} ${className}`}
      title={active ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(movie);
      }}
    >
      {active ? "❤" : "♡"}
    </button>
  );
}

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  const hasPoster = movie.Poster && movie.Poster !== "N/A" && !imgError;
  const firstLetter = movie.Title?.charAt(0).toUpperCase() || "★";

  return (
    <Link to={`/movie/${movie.imdbID}`} className="movie-card">
      <div className="poster-wrap">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="poster-fallback" style={{ background: getGradient(movie.Title || "movie") }}>
            <span className="fallback-letter">{firstLetter}</span>
            <span className="fallback-title">{movie.Title}</span>
            <span className="fallback-meta">{movie.Year} · {movie.Type}</span>
          </div>
        )}

        <div className="poster-overlay">
          <span className="view-btn">View Details →</span>
        </div>

        <span className="rating-badge">★ {movie.imdbRating || "N/A"}</span>
        <FavoriteButton movie={movie} />
      </div>

      <div className="card-body">
        <h3 className="card-title" title={movie.Title}>{movie.Title}</h3>
        <p className="card-meta">{movie.Year} · {movie.Type}</p>
      </div>
    </Link>
  );
}