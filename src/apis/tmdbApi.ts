import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";

// Log para depuración de import.meta.env
console.log("Contenido de import.meta.env en tmdbApi:", import.meta.env);

const { VITE_BASE_URL, VITE_API_KEY } = getEnvVariables();

// Log para depuración
console.log("VITE_BASE_URL desde tmdbApi:", VITE_BASE_URL);
console.log("VITE_API_KEY desde tmdbApi:", VITE_API_KEY);

const tmdbApi = axios.create({
  baseURL: VITE_BASE_URL,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${VITE_API_KEY}`,
  },
});

// Ejemplo de función para obtener películas populares
export const getPopularMovies = async (page: number = 1) => {
  // Log para depuración de la URL completa
  console.log(
    "Solicitando a:",
    tmdbApi.getUri({
      url: "/movie/popular",
      params: { language: "en-US", page: page },
    })
  );
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
