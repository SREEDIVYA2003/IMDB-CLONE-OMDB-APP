import React, { useState, useEffect } from 'react';
import './App.css';

// Replace this with your OMDB API Key
const API_KEY = '96324b94'; // Replace with your OMDB API key

const App = () => {
  const [query, setQuery] = useState(''); // Search query
  const [movies, setMovies] = useState([]); // List of movies from search
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage on initial load
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [year, setYear] = useState(''); // Filter by year
  const [type, setType] = useState(''); // Filter by type (movie, series, etc.)

  // Fetch movies based on the search query and filters
  useEffect(() => {
    if (query) {
      const fetchMovies = async () => {
        const url = `https://www.omdbapi.com/?s=${query}&y=${year}&type=${type}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        setMovies(data.Search || []);
      };

      fetchMovies();
    } else {
      setMovies([]);
    }
  }, [query, year, type]);

  // Add movie to favorites
  const addToFavorites = (movie) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = [...prevFavorites, movie];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save to localStorage
      return updatedFavorites;
    });
  };

  // Remove movie from favorites
  const removeFromFavorites = (movieId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((movie) => movie.imdbID !== movieId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save to localStorage
      return updatedFavorites;
    });
  };

  return (
    <div className="App">
      <h1>IMDB Clone (omdb)</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Filter Options */}
      <div className="filters">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          {/* Add more years as needed */}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>
      </div>

      {/* Search Results */}
      {movies.length > 0 && (
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img src={movie.Poster} alt={movie.Title} />
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
              <button onClick={() => addToFavorites(movie)}>Add to Favorites</button>
            </div>
          ))}
        </div>
      )}

      {/* Favorite Movies */}
      <h2>My Favorite Movies</h2>
      {favorites.length > 0 ? (
        <div className="favorites-list">
          {favorites.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img src={movie.Poster} alt={movie.Title} />
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
              <button onClick={() => removeFromFavorites(movie.imdbID)}>
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite movies yet!</p>
      )}
    </div>
  );
};

export default App;
