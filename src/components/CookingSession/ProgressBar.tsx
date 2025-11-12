import {
  Paper,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import type { Recipe } from '../../types';
import { formatTime, calculateOverallProgress } from '../../utils/calculations.ts';

interface ProgressBarProps {
  recipe: Recipe;
  session: {
    overallRemainingSec: number;
  };
}

const ProgressBar = ({ recipe, session }: ProgressBarProps) => {
  const totalDurationSec = recipe.steps.reduce((sum, step) => sum + step.durationMinutes * 60, 0);
  const progress = calculateOverallProgress(session.overallRemainingSec, totalDurationSec);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Overall Progress
      </Typography>

      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2">
          Overall remaining: {formatTime(session.overallRemainingSec)}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {progress}%
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProgressBar;