import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Movie,
  MoviesState,
  SelectedMovie,
} from "../../interfaces/interfaces";
import {
  fetchPopularMovies,
  fetchSearchMovies,
  fetchMovieDetailsById,
} from "../thunks";

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

      .addCase(fetchMovieDetailsById.pending, (state) => {
        state.selectedMovieLoading = "pending";
        state.selectedMovieError = null;
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
