import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, RadioButtonChecked } from '@mui/icons-material';
import type { Recipe } from '../../types';

interface TimelineProps {
  recipe: Recipe;
  currentStepIndex?: number;
}

const Timeline = ({ recipe, currentStepIndex }: TimelineProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Timeline
      </Typography>

      <List>
        {recipe.steps.map((step, index) => {
          const isCompleted = currentStepIndex !== undefined && index < currentStepIndex;
          const isCurrent = currentStepIndex === index;
          const isUpcoming = currentStepIndex !== undefined && index > currentStepIndex;

          return (
            <ListItem
              key={step.id}
              sx={{
                bgcolor: isCurrent ? 'primary.light' : 'transparent',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Box sx={{ mr: 2 }}>
                {isCompleted && <CheckCircle color="success" />}
                {isCurrent && <RadioButtonChecked color="primary" />}
                {isUpcoming && <RadioButtonUnchecked color="disabled" />}
                {currentStepIndex === undefined && <RadioButtonUnchecked />}
              </Box>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={isCurrent ? 'bold' : 'normal'}>
                      Step {index + 1}: {step.description.substring(0, 50)}
                      {step.description.length > 50 ? '...' : ''}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={`${step.durationMinutes} min`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={step.type}
                      size="small"
                      color={step.type === 'cooking' ? 'error' : 'info'}
                    />
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default Timeline;