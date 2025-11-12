import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useAppDispatch } from '../../store/hooks.ts';
import { addRecipe } from '../../store/recipesSlice.ts';
import type { Recipe, Ingredient, RecipeStep, Difficulty } from '../../types';
// import { useSnackbar } from '../../hooks/useSnackbar.ts';
import IngredientForm from './IngredientForm.tsx';
import StepForm from './StepForm';

const RecipeBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (title.length < 3) {
      newErrors.push('Title must be at least 3 characters');
    }

    if (ingredients.length === 0) {
      newErrors.push('At least one ingredient is required');
    }

    if (steps.length === 0) {
      newErrors.push('At least one step is required');
    }

    // Validate each ingredient
    ingredients.forEach((ing, idx) => {
      if (!ing.name || ing.quantity <= 0 || !ing.unit) {
        newErrors.push(`Ingredient ${idx + 1} is invalid`);
      }
    });

    // Validate each step
    steps.forEach((step, idx) => {
      if (!step.description || step.durationMinutes <= 0) {
        newErrors.push(`Step ${idx + 1} is missing description or duration`);
      }

      if (step.type === 'cooking') {
        if (!step.cookingSettings) {
          newErrors.push(`Step ${idx + 1}: Cooking settings required for cooking steps`);
        } else {
          const { temperature, speed } = step.cookingSettings;
          if (temperature < 40 || temperature > 200) {
            newErrors.push(`Step ${idx + 1}: Temperature must be between 40-200`);
          }
          if (speed < 1 || speed > 5) {
            newErrors.push(`Step ${idx + 1}: Speed must be between 1-5`);
          }
        }
      }

      if (step.type === 'instruction') {
        if (!step.ingredientIds || step.ingredientIds.length === 0) {
          newErrors.push(`Step ${idx + 1}: At least one ingredient required for instruction steps`);
        }
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const recipe: Recipe = {
      id: uuidv4(),
      title,
      cuisine: cuisine || undefined,
      difficulty,
      ingredients,
      steps,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addRecipe(recipe));
    alert('Recipe saved successfully!');
    navigate('/recipes');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/recipes')}>
          Back
        </Button>
      </Box>

      <Typography variant="h4" fontWeight="bold" mb={4}>
        Create Recipe
      </Typography>

      {errors.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
          <Typography variant="subtitle2" color="error.dark" fontWeight="bold" mb={1}>
            Please fix the following errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errors.map((error, idx) => (
              <li key={idx}>
                <Typography variant="body2" color="error.dark">{error}</Typography>
              </li>
            ))}
          </ul>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Basic Information</Typography>
        
        <TextField
          fullWidth
          label="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
          required
          helperText="Minimum 3 characters"
        />

        <TextField
          fullWidth
          label="Cuisine (Optional)"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            label="Difficulty"
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <IngredientForm ingredients={ingredients} setIngredients={setIngredients} />
      
      <StepForm steps={steps} setSteps={setSteps} ingredients={ingredients} />

      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          fullWidth
        >
          Save Recipe
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/recipes')}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeBuilder;