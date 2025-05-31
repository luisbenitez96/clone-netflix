import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/clone-netflix/", // Asegúrate que 'clone-netflix' sea el nombre de tu repo
  // Comentario para forzar recompilación
});
