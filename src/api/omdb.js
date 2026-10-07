import axios from "axios";

const api = axios.create({
  baseURL: "https://www.omdbapi.com/",
  params: { apikey: import.meta.env.VITE_OMDB_KEY },
});

export async function searchMovies(query, page = 1, signal) {
  const { data } = await api.get("/", { params: { s: query, page }, signal });

  if (data.Response === "False") {
    if (data.Error === "Movie not found!") return { movies: [], total: 0 };
    throw new Error(data.Error || "Something went wrong while fetching movies.");
  }

  return { movies: data.Search, total: Number(data.totalResults) };
}


export async function enrichWithRatings(movies, signal) {
  if (!movies?.length) return [];
  const results = await Promise.allSettled(
    movies.map((m) => api.get("/", { params: { i: m.imdbID }, signal }))
  );
  return movies.map((m, i) => {
    const res = results[i];
    const rating =
      res.status === "fulfilled" && res.value.data.imdbRating !== "N/A"
        ? res.value.data.imdbRating
        : null;
    return { ...m, imdbRating: rating };
  });
}

export async function getMovieById(id, signal) {
  const { data } = await api.get("/", { params: { i: id, plot: "full" }, signal });
  if (data.Response === "False") throw new Error(data.Error || "Movie not found.");
  return data;
}