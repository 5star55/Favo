import { createContext, useContext, useState } from "react";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // Load favorites from localStorage only once
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev; // avoid duplicates
      const updated = [...prev, movie];
      localStorage.setItem("favorites", JSON.stringify(updated)); // save immediately
      return updated;
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => {
      const updated = prev.filter((m) => m.id !== movieId);
      localStorage.setItem("favorites", JSON.stringify(updated)); // save immediately
      return updated;
    });
  };

  const isFavorite = (movieId) => favorites.some((m) => m.id === movieId);

  return (
    <MovieContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => useContext(MovieContext);
