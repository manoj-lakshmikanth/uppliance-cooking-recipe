import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks.ts';
import RecipeCard from './RecipeCard.tsx';
import RecipeFilters from './RecipeFilters.tsx';
import type { Difficulty } from '../../types/index.ts';
import { calculateTotalTime } from '../../utils/calculations.ts';

const RecipeList = () => {
  const navigate = useNavigate();
  const recipes = useAppSelector(state => state.recipes.recipes);
  
  const [difficultyFilters, setDifficultyFilters] = useState<Difficulty[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter recipes
  let filteredRecipes = recipes;
  if (difficultyFilters.length > 0) {
    filteredRecipes = filteredRecipes.filter(r => difficultyFilters.includes(r.difficulty));
  }

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    const timeA = calculateTotalTime(a.steps);
    const timeB = calculateTotalTime(b.steps);
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          My Recipes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/create')}
        >
          Create Recipe
        </Button>
      </Box>

      <RecipeFilters
        difficultyFilters={difficultyFilters}
        setDifficultyFilters={setDifficultyFilters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {sortedRecipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No recipes found. Create your first recipe!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedRecipes.map(recipe => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RecipeList;