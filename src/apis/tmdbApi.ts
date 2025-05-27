import axios from "axios";

const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzQ4YWU1OTliOTVjYmE1MDIwMTk4NDk3YjViZWFlNSIsIm5iZiI6MTc0ODM2NjA5Ny40MDcsInN1YiI6IjY4MzVmMzExM2ZhZDA0ZGNhNmE4NzVkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hq8VT0JWRMJkUXxvmJ7YqtGOKZWebCh-3VjkQK7Y7TQ";
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

// Ejemplo de función para obtener películas populares
export const getPopularMovies = async (page: number = 1) => {
  try {
    const response = await tmdbApi.get("/movie/popular", {
      params: {
        language: "en-US", // Puedes cambiarlo a 'es-MX' o 'es-ES' para español
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error; // O manejar el error como prefieras
  }
};

export const searchMovies = async (query: string, page: number = 1) => {
  if (!query.trim()) {
    // Evitar búsquedas vacías
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: {
        query: query,
        language: "en-US", // O 'es-MX', 'es-ES'
        page: page,
        include_adult: false, // Opcional: para excluir contenido para adultos
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies for query "${query}":`, error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: string | number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        language: "en-US", // O 'es-MX', 'es-ES'
        // Podrías añadir 'append_to_response': 'videos,credits' para obtener más datos
      },
    });
    return response.data; // Esto debería ser el objeto de detalles de la película
  } catch (error) {
    console.error(`Error fetching details for movie ID ${movieId}:`, error);
    throw error;
  }
};

// Aquí puedes añadir más funciones para otros endpoints, como:
// export const getMovieDetails = async (movieId) => { ... };

export default tmdbApi;
