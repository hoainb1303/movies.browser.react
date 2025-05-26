import React, { use } from "react";
import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

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
  const [isLoading, setIsLoading] = useState(false);

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

      // If response is ok, set data to JSON
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
    } catch (error) {
      console.error("Có lỗi trong lúc tải dữ liệu phim:", error);
      setErrorMessage("Tải dữ liệu phim thật bại. Hãy thử lại sau.");
    } finally {
      // Set loading state to false no matter what happens after fetching
      setIsLoading(false);
    }
  };

  // Put searchTerm in useEffect's dependency array to fetch movies whenever the search term changes
  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

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
        <section className="all-movies">
          <h2 className="mt-[40px]">Tất cả phim</h2>
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
