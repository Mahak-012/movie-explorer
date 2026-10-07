import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main className="container page">
      <div className="section-head">
        <h2>❤️ My Favorites</h2>
        <span className="total-count">{favorites.length} saved</span>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-box">
          <span className="empty-icon">💔</span>
          <h3>No favorites yet</h3>
          <p>Tap the heart on any movie to save it here.</p>
          <Link to="/" className="btn primary">Browse Movies</Link>
        </div>
      ) : (
        <div className="grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}