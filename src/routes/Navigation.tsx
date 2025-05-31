import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MovieDetailsPage from "../pages/MovieDetailsPage";

export const Navigation = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
      </Routes>
    </>
  );
};
