import React, { use } from "react";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  // State variables to manage search term, error message, movie list, and loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const fetchMovies = async (query = "") => {
    // Reset error message and loading state before fetching
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      // Check if response is ok before set data, if not throw an error
      if (!response.ok) {
        throw new Error("Tải dữ liệu phim thật bại.");
      }

      // If response is ok, set data to JSON6
      const data = await response.json();

      // Check if fetched data response then set movie list to empty list and set error message if response is false
      if (data.Response === "False") {
        setErrorMessage(
          data.Error || "Tải dữ liệu phim thật bại. Hãy thử lại sau."
        );
        setMovieList([]);
        return;
      }

      // Set the movie list with the fetched data if everything is ok
      setMovieList(data.results || []);
      //If search query is exists and there're result => Update search result to the database
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Có lỗi trong lúc tải dữ liệu phim:", error);
      setErrorMessage("Tải dữ liệu phim thật bại. Hãy thử lại sau.");
    } finally {
      // Set loading state to false no matter what happens after fetching
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error("Có lỗi trong lúc tải dữ liệu phim thịnh hành:", error);
    }
  };

  // Use useDebounce to delay the search term update by 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Put debouncedSearchTerm (not searchTerm) in useEffect's dependency array to fetch movies whenever the search term changes
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner"></img>
          <h1>
            Tìm <span className="text-gradient">Bộ Phim</span> Mà Bạn<br></br>
            Sẽ Xem Tối Nay
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Phim phổ biến</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title}></img>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>Tất cả phim</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
