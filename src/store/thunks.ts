import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMovieDetails,
  getPopularMovies,
  searchMovies,
} from "../apis/tmdbApi";
import type { Movie, SelectedMovie } from "../interfaces/interfaces";

// Thunk para obtener películas populares
export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPopularMovies();
      return response.results;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch popular movies");
    }
  }
);

// Thunk para buscar películas
export const fetchSearchMovies = createAsyncThunk(
  "movies/fetchSearch",
  async (searchTerm: string, { rejectWithValue }) => {
    if (!searchTerm.trim()) {
      return { results: [] as Movie[], searchTerm };
    }
    try {
      const response = await searchMovies(searchTerm);
      return { results: response.results, searchTerm };
    } catch (err: any) {
      return rejectWithValue({
        message:
          err.message || `Failed to search movies for query: ${searchTerm}`,
        searchTerm,
      });
    }
  }
);

export const fetchMovieDetailsById = createAsyncThunk<
  SelectedMovie,
  string,
  { rejectValue: string }
>("movies/fetchDetailsById", async (movieId, { rejectWithValue }) => {
  try {
    const response = await getMovieDetails(movieId);
    return response as SelectedMovie;
  } catch (err: any) {
    return rejectWithValue(
      err.message || `Failed to fetch details for movie ID ${movieId}`
    );
  }
});
