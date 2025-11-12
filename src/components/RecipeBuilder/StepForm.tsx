import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import type { RecipeStep, Ingredient } from '../../types';

interface StepFormProps {
  steps: RecipeStep[];
  setSteps: (steps: RecipeStep[]) => void;
  ingredients: Ingredient[];
}

const StepForm = ({ steps, setSteps, ingredients }: StepFormProps) => {
  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: uuidv4(),
        description: '',
        type: 'instruction',
        durationMinutes: 5,
        ingredientIds: [],
      },
    ]);
  };

  const updateStep = (index: number, field: keyof RecipeStep, value: any) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };

    // Clear type-specific fields when type changes
    if (field === 'type') {
      if (value === 'cooking') {
        delete updated[index].ingredientIds;
        updated[index].cookingSettings = { temperature: 100, speed: 3 };
      } else {
        delete updated[index].cookingSettings;
        updated[index].ingredientIds = [];
      }
    }

    setSteps(updated);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const updated = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setSteps(updated);
  };

  const updateCookingSettings = (
    index: number,
    field: 'temperature' | 'speed',
    value: number
  ) => {
    const updated = [...steps];
    updated[index].cookingSettings = {
      ...updated[index].cookingSettings!,
      [field]: value,
    };
    setSteps(updated);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Steps</Typography>
        <Button startIcon={<Add />} onClick={addStep}>
          Add Step
        </Button>
      </Box>

      {steps.map((step, index) => (
        <Paper key={step.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Step {index + 1}
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={() => moveStep(index, 'up')}
                disabled={index === 0}
              >
                <ArrowUpward />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => moveStep(index, 'down')}
                disabled={index === steps.length - 1}
              >
                <ArrowDownward />
              </IconButton>
              <IconButton color="error" onClick={() => removeStep(index)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={step.description}
                onChange={(e) => updateStep(index, 'description', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={step.type}
                  label="Type"
                  onChange={(e) => updateStep(index, 'type', e.target.value)}
                >
                  <MenuItem value="instruction">Instruction</MenuItem>
                  <MenuItem value="cooking">Cooking</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={step.durationMinutes}
                onChange={(e) => updateStep(index, 'durationMinutes', parseInt(e.target.value))}
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>

            {step.type === 'cooking' && (
              <>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Temperature (°C)"
                    type="number"
                    value={step.cookingSettings?.temperature}
                    onChange={(e) =>
                      updateCookingSettings(index, 'temperature', parseInt(e.target.value))
                    }
                    inputProps={{ min: 40, max: 200 }}
                    helperText="40-200°C"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Speed"
                    type="number"
                    value={step.cookingSettings?.speed}
                    onChange={(e) => updateCookingSettings(index, 'speed', parseInt(e.target.value))}
                    inputProps={{ min: 1, max: 5 }}
                    helperText="1-5"
                  />
                </Grid>
              </>
            )}

            {step.type === 'instruction' && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Ingredients</InputLabel>
                  <Select
                    multiple
                    value={step.ingredientIds || []}
                    onChange={(e) => updateStep(index, 'ingredientIds', e.target.value)}
                    input={<OutlinedInput label="Ingredients" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => {
                          const ing = ingredients.find((i) => i.id === id);
                          return <Chip key={id} label={ing?.name || id} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {ingredients.map((ingredient) => (
                      <MenuItem key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}

      {steps.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No steps added yet. Click "Add Step" to start.
        </Typography>
      )}
    </Paper>
  );
};

export default StepForm;