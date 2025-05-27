import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Usar en lugar de `useDispatch` simple
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Usar en lugar de `useSelector` simple
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
