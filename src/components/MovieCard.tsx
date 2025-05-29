import React from "react";
import { Link } from "react-router-dom";
import "./styles/MovieCard.css";

interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  poster_path,
  overview,
}) => {
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w300${poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";
  return (
    <Link to={`/movie/${id}`} className="movie-card-link">
      <div className="movie-card">
        <img src={imageUrl} alt={title} className="movie-card-poster" />
        <div className="movie-card-body">
          <h3 className="movie-card-title">{title}</h3>
          <p className="movie-card-overview">
            {overview.substring(0, 100)}...
          </p>{" "}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
