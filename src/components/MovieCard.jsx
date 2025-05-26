import React from "react";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieCard = ({
  movie: {
    id,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  },
}) => {
  const [mainCast, setMainCast] = useState("");

  const fetchMainCast = async () => {
    try {
      const endpoint = `${API_BASE_URL}/movie/${id}/credits`;
      const response = await fetch(endpoint, API_OPTIONS);
      // Check if response is ok before set credit, if not throw an error
      if (!response.ok) {
        throw new Error("Tải dữ liệu phim thật bại.");
      }
      // If response is ok, set credit to JSON
      const credit = await response.json();
      // Get the first two cast members and set them as main cast
      setMainCast(`${credit.cast[0].name}, ${credit.cast[1].name}`);
    } catch (error) {
      console.error("Tải dữ liệu phim thật bại:", error);
    }
  };

  useEffect(() => {
    fetchMainCast();
  }, []);

  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "./no-image.png"
        }
        alt={title}
      ></img>
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
          <p className="cast">{mainCast}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
