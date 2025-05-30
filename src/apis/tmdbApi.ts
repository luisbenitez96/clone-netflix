import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";

const { VITE_BASE_URL, VITE_API_KEY } = getEnvVariables();

const tmdbApi = axios.create({
  baseURL: VITE_BASE_URL,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${VITE_API_KEY}`,
  },
});

export const getPopularMovies = async (page: number = 1) => {
  tmdbApi.getUri({
    url: "/movie/popular",
    params: { language: "en-US", page: page },
  });

  try {
    const response = await tmdbApi.get("/movie/popular", {
      params: {
        language: "en-US",
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const searchMovies = async (query: string, page: number = 1) => {
  if (!query.trim()) {
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: {
        query: query,
        language: "en-US",
        page: page,
        include_adult: false,
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
        language: "en-US",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ID ${movieId}:`, error);
    throw error;
  }
};

export default tmdbApi;
