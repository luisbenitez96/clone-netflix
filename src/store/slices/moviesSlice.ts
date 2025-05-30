import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getPopularMovies as apiGetPopularMovies,
  searchMovies as apiSearchMovies,
  getMovieDetails as apiGetMovieDetails,
} from "../../apis/tmdbApi";

// Definimos los tipos para el estado y las películas
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  backdrop_path: string | null;
}

// Interfaz para detalles de película (puede ser más completa)
interface Genre {
  id: number;
  name: string;
}
interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface SelectedMovie extends Movie {
  backdrop_path: any;
  // Extiende la Movie básica
  genres?: Genre[];
  homepage?: string | null;
  imdb_id?: string | null;
  production_companies?: ProductionCompany[];
  release_date?: string;
  runtime?: number | null;
  status?: string;
  tagline?: string | null;
  vote_average?: number;
  vote_count?: number;
}

interface MoviesState {
  popularMovies: Movie[];
  searchResults: Movie[];
  searchTerm: string;
  currentView: "popular" | "search";
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  selectedMovie: SelectedMovie | null;
  selectedMovieLoading: "idle" | "pending" | "succeeded" | "failed";
  selectedMovieError: string | null;
}

const initialState: MoviesState = {
  popularMovies: [],
  searchResults: [],
  searchTerm: "",
  currentView: "popular",
  loading: "idle",
  error: null,
  selectedMovie: null,
  selectedMovieLoading: "idle",
  selectedMovieError: null,
};

// Thunk para obtener películas populares
export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetPopularMovies();
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
      const response = await apiSearchMovies(searchTerm);
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

// Thunk para obtener detalles de una película por ID
export const fetchMovieDetailsById = createAsyncThunk<
  SelectedMovie, // Tipo de valor de retorno en caso de éxito
  string, // Tipo del argumento (movieId)
  { rejectValue: string } // Tipo del valor de rechazo
>("movies/fetchDetailsById", async (movieId, { rejectWithValue }) => {
  try {
    const response = await apiGetMovieDetails(movieId);
    return response as SelectedMovie; // Aseguramos que el tipo sea SelectedMovie
  } catch (err: any) {
    return rejectWithValue(
      err.message || `Failed to fetch details for movie ID ${movieId}`
    );
  }
});

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<"popular" | "search">) => {
      state.currentView = action.payload;
      if (action.payload === "popular") {
        state.searchResults = [];
      }
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.searchResults = [];
      state.currentView = "popular";
      state.loading = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        fetchPopularMovies.fulfilled,
        (state, action: PayloadAction<Movie[]>) => {
          state.loading = "succeeded";
          state.popularMovies = action.payload;
          state.currentView = "popular";
        }
      )
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchSearchMovies.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        fetchSearchMovies.fulfilled,
        (
          state,
          action: PayloadAction<{ results: Movie[]; searchTerm: string }>
        ) => {
          state.loading = "succeeded";
          state.searchResults = action.payload.results;
          state.searchTerm = action.payload.searchTerm;
          state.currentView = "search";
        }
      )
      .addCase(
        fetchSearchMovies.rejected,
        (
          state,
          action: PayloadAction<
            { message: string; searchTerm: string } | string | unknown
          >
        ) => {
          state.loading = "failed";
          if (
            typeof action.payload === "object" &&
            action.payload &&
            "message" in action.payload &&
            "searchTerm" in action.payload
          ) {
            state.error = (action.payload as { message: string }).message;
            state.searchTerm = (
              action.payload as { searchTerm: string }
            ).searchTerm;
          } else if (typeof action.payload === "string") {
            state.error = action.payload;
          } else {
            state.error = "An unknown error occurred during search";
          }
        }
      )
      // Casos para fetchMovieDetailsById
      .addCase(fetchMovieDetailsById.pending, (state) => {
        state.selectedMovieLoading = "pending";
        state.selectedMovieError = null;
        // state.selectedMovie = null; // Opcional: limpiar la película anterior mientras carga la nueva
      })
      .addCase(
        fetchMovieDetailsById.fulfilled,
        (state, action: PayloadAction<SelectedMovie>) => {
          state.selectedMovieLoading = "succeeded";
          state.selectedMovie = action.payload;
        }
      )
      .addCase(fetchMovieDetailsById.rejected, (state, action) => {
        state.selectedMovieLoading = "failed";
        state.selectedMovieError =
          action.payload ?? "Failed to load movie details";
      });
  },
});

export const { setSearchTerm, setCurrentView, clearSearch } =
  moviesSlice.actions;
export default moviesSlice.reducer;
