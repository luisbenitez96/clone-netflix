import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./slices/moviesSlice"; // Importamos el reducer del slice

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    // Aquí puedes añadir otros reducers si tienes más slices
  },
});

// Inferir los tipos `RootState` y `AppDispatch` del propio store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
