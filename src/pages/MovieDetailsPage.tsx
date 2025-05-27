import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMovieDetailsById } from "../store/slices/moviesSlice"; // Importar el thunk
// Podríamos añadir un componente de estilo para la página de detalles, ej: './MovieDetailsPage.css'

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
    // Opcional: Limpiar selectedMovie al desmontar el componente si es necesario
    // return () => {
    //   dispatch(clearSelectedMovie()); // Necesitaríamos una acción para esto
    // };
  }, [dispatch, movieId]);

  if (!movieId) {
    // Aunque la ruta debería garantizar movieId, es una buena comprobación
    return (
      <div style={{ padding: "20px", color: "white" }}>
        ID de película inválido.
      </div>
    );
  }

  if (loading === "pending") {
    return (
      <div style={{ padding: "20px", color: "white", textAlign: "center" }}>
        Cargando detalles de la película...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "white", textAlign: "center" }}>
        Error: {error}
      </div>
    );
  }

  if (!selectedMovie || String(selectedMovie.id) !== movieId) {
    // Comprobación adicional por si el selectedMovie en el store no es el actual
    // o si se navega muy rápido entre detalles.
    // Si 'loading' es 'succeeded' y no hay 'selectedMovie', podría ser un error de ID no encontrado por la API.
    if (loading === "succeeded") {
      return (
        <div style={{ padding: "20px", color: "white", textAlign: "center" }}>
          No se encontraron detalles para esta película.
        </div>
      );
    }
    return null; // O un loader si se espera que selectedMovie se actualice
  }

  const posterBaseUrl = "https://image.tmdb.org/t/p/";
  const backdropUrl = selectedMovie.backdrop_path
    ? `${posterBaseUrl}w1280${selectedMovie.backdrop_path}`
    : "";
  const posterUrl = selectedMovie.poster_path
    ? `${posterBaseUrl}w500${selectedMovie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    // Considerar un div contenedor con un fondo de backdrop si existe
    <div
      className="movie-details-container"
      style={{
        color: "white",
        padding: "20px",
        backgroundImage: backdropUrl
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${backdropUrl})`
          : "",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        minHeight: "100vh",
      }}>
      <Link
        to="/"
        className="back-link"
        style={{
          color: "#e50914",
          textDecoration: "none",
          marginBottom: "20px",
          display: "inline-block",
          fontSize: "1.2rem",
          background: "rgba(0,0,0,0.5)",
          padding: "5px 10px",
          borderRadius: "4px",
        }}>
        &larr; Volver
      </Link>

      <div
        className="movie-details-content"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "30px",
          background: "rgba(0,0,0,0.7)",
          padding: "20px",
          borderRadius: "8px",
        }}>
        <div className="movie-details-poster">
          <img
            src={posterUrl}
            alt={selectedMovie.title}
            style={{ width: "300px", borderRadius: "8px" }}
          />
        </div>
        <div className="movie-details-info" style={{ flex: 1 }}>
          <h1>{selectedMovie.title}</h1>
          {selectedMovie.tagline && (
            <p
              className="tagline"
              style={{
                fontStyle: "italic",
                color: "#ccc",
                marginBottom: "20px",
              }}>
              "{selectedMovie.tagline}"
            </p>
          )}

          <h3>Resumen</h3>
          <p>{selectedMovie.overview}</p>

          {selectedMovie.genres && selectedMovie.genres.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <strong>Géneros:</strong>{" "}
              {selectedMovie.genres.map((g) => g.name).join(", ")}
            </div>
          )}

          {selectedMovie.release_date && (
            <p style={{ marginTop: "10px" }}>
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
                style={{ color: "#e50914" }}>
                Página Oficial
              </a>
            </p>
          )}

          {/* Podrías añadir más información como productoras, etc. */}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
