import React from "react";
import { Link } from "react-router-dom";
import { useMovieContext } from "../Contexts/MovieContext";
import MovieCard from "../Components/MovieCard";
import HeartIcon from "../Components/HeartIcon";
import '../css/Favorites.css';

function Favorites() {
  const { favorites } = useMovieContext();

  if (favorites.length === 0) {
    return (
      <div className="state-box favorites-empty">
        <div className="state-icon"><HeartIcon size={44}/></div>
        <h2>No favorites yet</h2>
        <p>Tap the heart on any movie and it will show up here, so you can find it again later.</p>
        <Link to="/" className="primary-btn">Browse movies</Link>
      </div>
    );
  }

  return (
    <div className="favorites">
      <header className="favorites-header">
        <div>
          <h1>My Favorites</h1>
          <p>{favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved</p>
        </div>
        <Link to="/" className="favorites-browse">+ Find more</Link>
      </header>
      <div className="movies-grid">
        {favorites.map((fav) => (
          <MovieCard key={fav.id} movie={fav} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
