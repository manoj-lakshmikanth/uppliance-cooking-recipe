import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import type { Recipe } from '../../types';
import { formatTime, calculateStepProgress } from '../../utils/calculations.ts';

interface ActiveStepPanelProps {
  recipe: Recipe;
  session: {
    currentStepIndex: number;
    stepRemainingSec: number;
    isRunning: boolean;
  };
}

const ActiveStepPanel = ({ recipe, session }: ActiveStepPanelProps) => {
  const currentStep = recipe.steps[session.currentStepIndex];
  const stepDurationSec = currentStep.durationMinutes * 60;
  const progress = calculateStepProgress(session.stepRemainingSec, stepDurationSec);

  console.log(session, "inside progress")

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
      <Typography variant="h6" mb={2}>
        Step {session.currentStepIndex + 1} of {recipe.steps.length}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={100}
            thickness={4}
            sx={{ color: 'white' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" component="div" fontWeight="bold">
              {formatTime(session.stepRemainingSec)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" mb={1}>
            {currentStep.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentStep.type === 'cooking' && currentStep.cookingSettings && (
              <>
                <Chip
                  label={`${currentStep.cookingSettings.temperature}°C`}
                  size="small"
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                />
                <Chip
                  label={`Speed ${currentStep.cookingSettings.speed}`}
                  size="small"
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                />
              </>
            )}

            {currentStep.type === 'instruction' && currentStep.ingredientIds && (
              <>
                {currentStep.ingredientIds.map((ingId) => {
                  const ingredient = recipe.ingredients.find((i) => i.id === ingId);
                  return ingredient ? (
                    <Chip
                      key={ingId}
                      label={`${ingredient.name} (${ingredient.quantity}${ingredient.unit})`}
                      size="small"
                      sx={{ bgcolor: 'white', color: 'primary.main' }}
                    />
                  ) : null;
                })}
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Chip
        label={session.isRunning ? 'Running' : 'Paused'}
        color={session.isRunning ? 'success' : 'warning'}
      />
    </Paper>
  );
};

export default ActiveStepPanel;