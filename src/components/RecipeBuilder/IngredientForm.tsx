import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, Delete } from '@mui/icons-material';
import type { Ingredient } from '../../types';

interface IngredientFormProps {
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
}

const IngredientForm = ({ ingredients, setIngredients }: IngredientFormProps) => {
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: uuidv4(), name: '', quantity: 1, unit: 'g' },
    ]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Ingredients</Typography>
        <Button startIcon={<Add />} onClick={addIngredient}>
          Add Ingredient
        </Button>
      </Box>

      {ingredients.map((ingredient, index) => (
        <Grid container spacing={2} key={ingredient.id} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              label="Name"
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, 'name', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={ingredient.quantity}
              onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
              inputProps={{ min: 0.1, step: 0.1 }}
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 2 }}>
            <TextField
              fullWidth
              label="Unit"
              value={ingredient.unit}
              onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
              placeholder="g, ml, pcs"
            />
          </Grid>
          <Grid size={{ xs: 2, sm: 2 }}>
            <IconButton color="error" onClick={() => removeIngredient(index)}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {ingredients.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No ingredients added yet. Click "Add Ingredient" to start.
        </Typography>
      )}
    </Paper>
  );
};

export default IngredientForm;