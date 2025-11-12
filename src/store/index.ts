import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './recipesSlice.ts';
import sessionReducer from './sessionSlice.ts';

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

