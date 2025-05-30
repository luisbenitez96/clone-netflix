import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
  fetchMovieDetailsById,
} from "../store";

const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const dispatch = useAppDispatch();

  const {
    selectedMovie,
    selectedMovieLoading: loading, // Renombrar para claridad local
    selectedMovieError: error, // Renombrar para claridad local
  } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieDetailsById(movieId));
    }
  }, [dispatch, movieId]);

  if (!movieId) {
    return (
      <div className="status-message status-message-error">
        ID de película inválido.
      </div>
    );
  }

  if (loading === "pending") {
    return (
      <div className="status-message">Cargando detalles de la película...</div>
    );
  }

  if (error) {
    return (
      <div className="status-message status-message-error">Error: {error}</div>
    );
  }

  if (!selectedMovie || String(selectedMovie.id) !== movieId) {
    if (loading === "succeeded") {
      return (
        <div className="status-message">
          No se encontraron detalles para esta película.
        </div>
      );
    }
    return null;
  }

  const posterBaseUrl = "https://image.tmdb.org/t/p/";
  const backdropUrl = selectedMovie.backdrop_path
    ? `${posterBaseUrl}w1280${selectedMovie.backdrop_path}`
    : "";
  const posterUrl = selectedMovie.poster_path
    ? `${posterBaseUrl}w500${selectedMovie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div
      className="movie-details-container"
      style={{
        backgroundImage: backdropUrl
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${backdropUrl})`
          : "",
      }}>
      <Link to="/" className="back-link">
        &larr; Volver
      </Link>

      <div className="movie-details-content">
        <div className="movie-details-poster">
          <img
            src={posterUrl}
            alt={selectedMovie.title}
            className="movie-details-poster-img"
          />
        </div>
        <div className="movie-details-info">
          <h1>{selectedMovie.title}</h1>
          {selectedMovie.tagline && (
            <p className="tagline">"{selectedMovie.tagline}"</p>
          )}

          <h3>Resumen</h3>
          <p>{selectedMovie.overview}</p>

          {selectedMovie.genres && selectedMovie.genres.length > 0 && (
            <div className="movie-details-genres">
              <strong>Géneros:</strong>{" "}
              {selectedMovie.genres.map((g) => g.name).join(", ")}
            </div>
          )}

          {selectedMovie.release_date && (
            <p className="movie-details-release">
              <strong>Fecha de Estreno:</strong> {selectedMovie.release_date}
            </p>
          )}
          {selectedMovie.runtime && (
            <p>
              <strong>Duración:</strong> {selectedMovie.runtime} minutos
            </p>
          )}
          {selectedMovie.vote_average && (
            <p>
              <strong>Calificación:</strong>{" "}
              {selectedMovie.vote_average.toFixed(1)}/10 (
              {selectedMovie.vote_count} votos)
            </p>
          )}
          {selectedMovie.homepage && (
            <p>
              <a
                href={selectedMovie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="movie-details-homepage-link">
                Página Oficial
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
