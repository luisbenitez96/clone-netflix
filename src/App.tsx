import { useState, useEffect } from "react";
import { getPopularMovies, searchMovies } from "./apis/tmdbApi"; // Añadir searchMovies
import MovieCard from "./components/MovieCard"; // Importamos MovieCard
// import axios from "axios"; // Comentado por ahora
// import { authOptions } from "./apis/AuthApi"; // Comentado por ahora

// Definimos una interfaz básica para el tipo de película que esperamos de la API
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

interface PopularMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

function App() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentView, setCurrentView] = useState<"popular" | "search">(
    "popular"
  ); // Para saber qué mostrar
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar películas populares al inicio
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const data: PopularMoviesResponse = await getPopularMovies();
        setPopularMovies(data.results);
        setCurrentView("popular");
        setError(null);
      } catch (err) {
        console.error("Error fetching popular movies:", err);
        setError("No se pudieron cargar las películas populares.");
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); // Prevenir recarga de página si es un form
    if (!searchTerm.trim()) {
      setSearchResults([]);
      // Si la búsqueda se borra, podríamos volver a populares o mostrar un mensaje
      // Por ahora, si la búsqueda es vacía tras un submit, no cambiamos de vista necesariamente
      // Opcionalmente: setCurrentView('popular');
      return;
    }
    try {
      setLoading(true);
      const data: PopularMoviesResponse = await searchMovies(searchTerm);
      setSearchResults(data.results);
      setCurrentView("search");
      setError(null);
    } catch (err) {
      console.error("Error searching movies:", err);
      setError("No se pudieron encontrar películas para tu búsqueda.");
      setSearchResults([]); // Limpiar resultados en caso de error
    } finally {
      setLoading(false);
    }
  };

  const moviesToDisplay =
    currentView === "search" ? searchResults : popularMovies;
  const listTitle =
    currentView === "search"
      ? searchResults.length > 0 || loading
        ? `Resultados para "${searchTerm}"`
        : `No hay resultados para "${searchTerm}"`
      : "Películas Populares";

  // Ajuste en la lógica de carga y error para ser más descriptivos
  if (loading && moviesToDisplay.length === 0 && currentView === "popular") {
    return <div>Cargando películas populares...</div>;
  }
  if (loading && currentView === "search") {
    return <div>Buscando "{searchTerm}"...</div>;
  }

  if (error && currentView === "popular") {
    return <div>Error: {error} (Populares)</div>;
  }
  if (error && currentView === "search" && moviesToDisplay.length === 0) {
    return <div>Error: {error} (Búsqueda)</div>;
  }

  return (
    <>
      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar películas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>

      <h1>{listTitle}</h1>
      <div className="movies-list">
        {!loading &&
          moviesToDisplay.length === 0 &&
          currentView === "search" && (
            <p>
              No se encontraron películas para "{searchTerm}". Intenta con otra
              búsqueda.
            </p>
          )}
        {!loading &&
          moviesToDisplay.length === 0 &&
          currentView === "popular" &&
          !error && (
            <p>No hay películas populares disponibles en este momento.</p>
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
}

export default App;
