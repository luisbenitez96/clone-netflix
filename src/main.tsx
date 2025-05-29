import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";

// Log para depurar variables de entorno directamente en main.tsx
console.log("VITE_BASE_URL en main.tsx:", import.meta.env.VITE_BASE_URL);
console.log("VITE_API_KEY en main.tsx:", import.meta.env.VITE_API_KEY);
console.log("Todas las variables de entorno en main.tsx:", import.meta.env);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
