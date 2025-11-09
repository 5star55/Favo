import React from "react";
import { useMovieContext } from "../Contexts/MovieContext";
import MovieCard from "../Components/MovieCard";
import '../css/Favorites.css';

function Favorites() {
  const { favorites } = useMovieContext();

  if (favorites.length === 0) {
    return (
      <div className='favorites-empty'>
        <h2>No Favorites yet</h2>
        <p>Start adding movies to your favorites and they will appear here</p>
      </div>
    );
  }

  return (
    <div className="movies-grid">
      {favorites.map((fav) => (
        <MovieCard key={fav.id} movie={fav} />
      ))}
    </div>
  );
}

export default Favorites;
