import type { Recipe } from '../types';

const STORAGE_KEY = 'recipes:v1';

export const loadRecipes = (): Recipe[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
};

export const saveRecipes = (recipes: Recipe[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes:', error);
  }
};