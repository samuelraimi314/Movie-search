import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchMovies = async (query) => {
    if (!query.trim()) return;
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=61507d7&s=${encodeURIComponent(query)}`);
      const data = await response.json();
      setMovies(data.Search || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  };

  useEffect(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (searchTerm.length >= 3) {
        fetchMovies(searchTerm);
      } else {
        setMovies([]);
      }
    }, 500);

    return () => clearTimeout(typingTimeoutRef.current);
  }, [searchTerm]);

  return (
    <main className="app-container">
      <header>
        <h1>Samuel's Technology</h1>
        <h2>Interested in latest movies?</h2>
        <h3>Movie Search</h3>
      </header>

      <input
        type="search"
        placeholder="Search for a movie"
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
        aria-label="Search for movies"
        autoComplete="off"
      />

      <section className="movies-list" aria-live="polite">
        {movies.length > 0 ? (
          movies.map(({ imdbID, Title, Year, Poster }) => (
            <article key={imdbID} className="movie-card" tabIndex={0}>
              <h4>{Title}</h4>
              <p>{Year}</p>
              {Poster !== 'N/A' ? (
                <img src={Poster} alt={`${Title} poster`} height="200" loading="lazy" />
              ) : (
                <div className="no-poster" aria-label="No poster available">No Poster</div>
              )}
            </article>
          ))
        ) : (
          searchTerm.length >= 3 && <p>No movies found.</p>
        )}
      </section>
    </main>
  );
}

export default App;
