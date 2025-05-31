export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  backdrop_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}
export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface SelectedMovie extends Movie {
  backdrop_path: any;

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

export interface MoviesState {
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
