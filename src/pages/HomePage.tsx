import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import {
  useAppDispatch,
  useAppSelector,
  fetchPopularMovies,
  fetchSearchMovies,
  clearSearch,
  setSearchTerm,
} from "../store";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    popularMovies,
    searchResults,
    searchTerm,
    currentView,
    loading,
    error,
  } = useAppSelector((state) => state.movies);

  const heroMovie = popularMovies.length > 0 ? popularMovies[0] : null; // Película para el banner

  useEffect(() => {
    if (
      currentView === "popular" &&
      popularMovies.length === 0 &&
      loading !== "pending"
    ) {
      dispatch(fetchPopularMovies());
    }
  }, [dispatch, currentView, popularMovies.length, loading]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    dispatch(fetchSearchMovies(searchTerm));
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const moviesToDisplay =
    currentView === "search" ? searchResults : popularMovies;
  let listTitle = "Películas Populares";
  if (currentView === "search") {
    if (loading === "pending") listTitle = `Buscando "${searchTerm}"...`;
    else if (searchResults.length > 0)
      listTitle = `Resultados para "${searchTerm}"`;
    else listTitle = `No hay resultados para "${searchTerm}"`;
  }

  // Mensajes de carga y error específicos para HomePage
  if (
    loading === "pending" &&
    moviesToDisplay.length === 0 &&
    currentView === "popular"
  ) {
    return (
      <div className="status-message">Cargando películas populares...</div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      {heroMovie && currentView === "popular" && (
        <div
          className="hero-banner"
          style={{
            backgroundImage: heroMovie.backdrop_path
              ? `linear-gradient(to bottom, rgba(20,20,20,0) 0%, rgba(20,20,20,0.8) 80%, rgba(20,20,20,1) 100%), url(https://image.tmdb.org/t/p/w1280${heroMovie.backdrop_path})`
              : "none",
            backgroundColor: heroMovie.backdrop_path
              ? "transparent"
              : "#141414",
          }}>
          <div className="hero-banner-content">
            <h2 className="hero-banner-title">{heroMovie.title}</h2>
            <p className="hero-banner-overview">
              {heroMovie.overview.substring(0, 200)}...
            </p>
            <Link to={`/movie/${heroMovie.id}`} className="hero-banner-button">
              Más Información
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Buscar películas..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          className="search-input"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => dispatch(clearSearch())}
            className="clear-search-button">
            Limpiar
          </button>
        )}
        <button
          type="submit"
          className="search-button"
          disabled={loading === "pending" && currentView === "search"}>
          {loading === "pending" && currentView === "search"
            ? "Buscando..."
            : "Buscar"}
        </button>
      </form>
      <h1>{listTitle}</h1>
      <div className="movies-list">
        {loading === "pending" && currentView === "search" && (
          <p className="status-message">Buscando "{searchTerm}"...</p>
        )}

        {/* Mostrar error específico de la lista si aplica, y no hay nada que mostrar */}
        {error &&
          currentView === "popular" &&
          popularMovies.length === 0 &&
          loading !== "pending" && (
            <p className="error-message">
              Error al cargar películas populares: {error}
            </p>
          )}
        {error &&
          currentView === "search" &&
          searchResults.length === 0 &&
          loading !== "pending" && (
            <p className="error-message">
              Error en la búsqueda de "{searchTerm}": {error}
            </p>
          )}

        {moviesToDisplay.length === 0 && loading !== "pending" && !error && (
          <p className="status-message">
            {currentView === "search"
              ? `No se encontraron películas para "${searchTerm}".`
              : "No hay películas populares disponibles."}
          </p>
        )}
        {moviesToDisplay.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
            overview={movie.overview}
          />
        ))}
      </div>
    </>
  );
};

export default HomePage;
