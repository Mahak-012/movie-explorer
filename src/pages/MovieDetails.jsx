import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieById } from "../api/omdb";
import ErrorMessage from "../components/ErrorMessage";
import { FavoriteButton } from "../components/MovieCard";

const RATING_LABELS = {
  "Internet Movie Database": "IMDb",
  "Rotten Tomatoes": "Rotten Tomatoes",
  Metacritic: "Metacritic",
};

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");
        setMovie(null);
        const data = await getMovieById(id, controller.signal);
        setMovie(data);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [id, retryKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <main className="container page">
        <div className="detail-skeleton">
          <div className="skeleton poster-lg-skeleton" />
          <div className="detail-skeleton-lines">
            <div className="skeleton line-skeleton" />
            <div className="skeleton line-skeleton short" />
            <div className="skeleton line-skeleton" />
            <div className="skeleton line-skeleton short" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page">
        <ErrorMessage message={error} onRetry={() => setRetryKey((k) => k + 1)} />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/" className="btn ghost">← Back to Home</Link>
        </div>
      </main>
    );
  }

  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <main className="container page">
      <Link to="/" className="back-link">← Back to Home</Link>

      <article className="detail-hero">
        <div className="detail-poster">
          {hasPoster ? (
            <img src={movie.Poster} alt={movie.Title} />
          ) : (
            <div className="poster-fallback tall">🎞️</div>
          )}
        </div>

        <div className="detail-info">
          <h1>{movie.Title}</h1>

          <div className="detail-tags">
            <span className="tag accent">
              {movie.imdbRating !== "N/A" ? `⭐ ${movie.imdbRating}/10` : "No rating"}
            </span>
            <span className="tag">{movie.Year}</span>
            <span className="tag">{movie.Rated}</span>
            <span className="tag">{movie.Runtime}</span>
          </div>

          <div className="genre-tags">
            {movie.Genre?.split(", ").map((g) => (
              <span className="genre" key={g}>{g}</span>
            ))}
          </div>

          <p className="plot">{movie.Plot}</p>

          <div className="facts">
            <div><span>Director</span><p>{movie.Director}</p></div>
            <div><span>Writer</span><p>{movie.Writer}</p></div>
            <div><span>Actors</span><p>{movie.Actors}</p></div>
            <div><span>Released</span><p>{movie.Released}</p></div>
            <div><span>Language</span><p>{movie.Language}</p></div>
            <div><span>Country</span><p>{movie.Country}</p></div>
            {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
              <div><span>Box Office</span><p>{movie.BoxOffice}</p></div>
            )}
            {movie.Awards && movie.Awards !== "N/A" && (
              <div><span>Awards</span><p>{movie.Awards}</p></div>
            )}
          </div>

          <div className="external-ratings">
            {movie.Ratings?.map((r) => (
              <div className="rating-pill" key={r.Source}>
                <span>{RATING_LABELS[r.Source] || r.Source}</span>
                <strong>{r.Value}</strong>
              </div>
            ))}
          </div>

          <div className="detail-actions">
            <FavoriteButton movie={movie} className="btn-like" />
            <a
              className="btn ghost"
              href={`https://www.imdb.com/title/${movie.imdbID}`}
              target="_blank"
              rel="noreferrer"
            >
              View on IMDb ↗
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}