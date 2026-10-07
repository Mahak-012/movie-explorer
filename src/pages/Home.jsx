import { useEffect, useState } from "react";
import { searchMovies, enrichWithRatings } from "../api/omdb";
import useDebounce from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const DEFAULT_QUERY = "Marvel";
const GENRES = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller", "Animation"];

export default function Home() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const totalPages = Math.ceil(total / 10);
  const activeQuery = debouncedQuery.trim() || DEFAULT_QUERY;

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");
        const { movies: results, total: totalResults } = await searchMovies(
          activeQuery, page, controller.signal
        );
        const enriched = await enrichWithRatings(results, controller.signal);
        setMovies(enriched);
        setTotal(totalResults);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [activeQuery, page, retryKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const goToPage = (p) => setPage((prev) => Math.min(Math.max(1, p), totalPages));

  return (
    <main className="container page">
      <section className="hero">
        <div className="hero-chip">
          <span className="dot" /> Discover Amazing Cinema
        </div>

        <h1 className="grad-text animated">CineVault</h1>

        <p>Search, explore and save your favorite movies</p>

        <div className="hero-stats">
          <div><strong>500K+</strong><span>Movies</span></div>
          <div><strong>10K+</strong><span>Series</span></div>
          <div><strong>100%</strong><span>Free</span></div>
        </div>

        <SearchBar value={query} onChange={setQuery} />

        <div className="genre-chips">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              className={`chip ${debouncedQuery.trim().toLowerCase() === g.toLowerCase() ? "active" : ""}`}
              onClick={() => setQuery(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      <div className="section-head">
        <h2>
          {debouncedQuery.trim()
            ? <>Results for <span className="grad-text">"{debouncedQuery.trim()}"</span></>
            : <>🔥 Trending <span className="grad-text">Now</span></>}
        </h2>
        {total > 0 && !loading && <span className="total-count">{total} movies</span>}
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={() => setRetryKey((k) => k + 1)} />
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="empty-box">
          <span className="empty-icon">🍿</span>
          <h3>No movies found</h3>
          <p>Try a different keyword for "{debouncedQuery.trim() || DEFAULT_QUERY}"</p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="grid">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn" disabled={page === 1} onClick={() => goToPage(page - 1)}>
                ← Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button className="btn" disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}