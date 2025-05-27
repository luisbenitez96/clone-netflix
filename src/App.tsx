import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Asegúrate que esta ruta sea correcta
import MovieDetailsPage from "./pages/MovieDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
