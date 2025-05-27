import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getPopularMovies as apiGetPopularMovies,
  searchMovies as apiSearchMovies,
} from "../../apis/tmdbApi"; // Renombramos para evitar colisión

// Definimos los tipos para el estado y las películas
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
}

interface MoviesState {
  popularMovies: Movie[];
  searchResults: Movie[];
  searchTerm: string; // Podríamos decidir si este va aquí o se queda local
  currentView: "popular" | "search";
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MoviesState = {
  popularMovies: [],
  searchResults: [],
  searchTerm: "",
  currentView: "popular",
  loading: "idle",
  error: null,
};

// Thunk para obtener películas populares
export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetPopularMovies(); // Usamos la función renombrada de la API
      return response.results; // TMDB devuelve { page, results, total_pages, total_results }
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
      return { results: [] as Movie[], searchTerm }; // Devolver searchTerm aquí también
    }
    try {
      const response = await apiSearchMovies(searchTerm); // Usamos la función renombrada de la API
      return { results: response.results, searchTerm };
    } catch (err: any) {
      // Incluir searchTerm en el valor rechazado para consistencia
      return rejectWithValue({
        message:
          err.message || `Failed to search movies for query: ${searchTerm}`,
        searchTerm,
      });
    }
  }
);

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
        state.searchResults = []; // Limpiar resultados de búsqueda al volver a populares
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
      // Casos para fetchPopularMovies
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        fetchPopularMovies.fulfilled,
        (state, action: PayloadAction<Movie[]>) => {
          state.loading = "succeeded";
          state.popularMovies = action.payload;
          state.currentView = "popular"; // Asegurar que la vista sea popular
        }
      )
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Casos para fetchSearchMovies
      .addCase(fetchSearchMovies.pending, (state, action) => {
        // action aquí puede no tener searchTerm aún
        state.loading = "pending";
        state.error = null;
        // Opcional: si quieres setear el searchTerm al iniciar la búsqueda desde el argumento del thunk
        // if (action.meta.arg) {
        //   state.searchTerm = action.meta.arg;
        // }
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
      );
  },
});

export const { setSearchTerm, setCurrentView, clearSearch } =
  moviesSlice.actions;
export default moviesSlice.reducer;
