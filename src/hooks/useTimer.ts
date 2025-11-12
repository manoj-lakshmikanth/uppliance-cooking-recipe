import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks.ts';
import { tickSecond } from '../store/sessionSlice';
import type { Recipe } from '../types';

export const useTimer = (recipeId: string | null, recipe: Recipe | undefined, isRunning: boolean) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!recipeId || !recipe || !isRunning) return;

    const interval = setInterval(() => {
      dispatch(tickSecond({ recipeId, recipe }));
    }, 1000);

    return () => clearInterval(interval);
  }, [recipeId, recipe, isRunning, dispatch]);
};