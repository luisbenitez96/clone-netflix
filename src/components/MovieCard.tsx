import React from "react";
import "./styles/MovieCard.css"; // Crearemos este archivo para los estilos

interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string | null; // poster_path puede ser null
  overview: string;
  // Podríamos añadir más props como vote_average, release_date, etc.
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  poster_path,
  overview,
}) => {
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w300${poster_path}` // Usamos w300 para un tamaño decente de póster
    : "https://via.placeholder.com/300x450?text=No+Image"; // Placeholder si no hay imagen

  return (
    <div className="movie-card">
      <img src={imageUrl} alt={title} className="movie-card-poster" />
      <div className="movie-card-body">
        <h3 className="movie-card-title">{title}</h3>
        <p className="movie-card-overview">
          {overview.substring(0, 100)}...
        </p>{" "}
        {/* Acortamos el overview */}
        {/* Aquí podríamos añadir más detalles, como un botón de "Ver más" o la calificación */}
      </div>
    </div>
  );
};

export default MovieCard;
