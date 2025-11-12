import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import { PlayArrow, Pause, Stop } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { pauseSession, resumeSession, stopCurrentStep } from '../../store/sessionSlice';
import { formatTime, calculateStepProgress } from '../../utils/calculations';
import { useTimer } from '../../hooks/useTimer';

const MiniPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { activeRecipeId, byRecipeId } = useAppSelector(state => state.session);
  const recipes = useAppSelector(state => state.recipes.recipes);

  const session = activeRecipeId ? byRecipeId[activeRecipeId] : undefined;
  const recipe = recipes.find(r => r.id === activeRecipeId);

  useTimer(activeRecipeId ?? null, recipe ?? undefined, session?.isRunning ?? false);
  if (!session || !recipe) return null;


  // Hide on active recipe's cooking page
  if (location.pathname === `/cook/${activeRecipeId}`) return null;

  const currentStep = recipe.steps[session.currentStepIndex];
  const stepDurationSec = currentStep.durationMinutes * 60;
  const progress = calculateStepProgress(session.stepRemainingSec, stepDurationSec);

  console.log(session, "progress")

  const handlePlayPause = () => {

    if (!activeRecipeId) return;

    if (session.isRunning) {
      dispatch(pauseSession(activeRecipeId));
    } else {
      dispatch(resumeSession(activeRecipeId));
    }
  };

  const handleStop = () => {

    if (!activeRecipeId) return;

    dispatch(stopCurrentStep({ recipeId: activeRecipeId, recipe }));
  };

  const handleClick = () => {
    navigate(`/cook/${activeRecipeId}`);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'primary.main',
        color: 'white',
        cursor: 'pointer',
        zIndex: 1000,
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={50}
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
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            {formatTime(session.stepRemainingSec)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} onClick={handleClick}>
        <Typography variant="subtitle1" fontWeight="bold">
          {recipe.title}
        </Typography>
        <Typography variant="body2">
          Step {session.currentStepIndex + 1} of {recipe.steps.length} · {formatTime(session.stepRemainingSec)}
        </Typography>
      </Box>

      <Chip
        label={session.isRunning ? 'Running' : 'Paused'}
        size="small"
        sx={{ bgcolor: 'white', color: 'primary.main' }}
      />

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handlePlayPause();
        }}
        sx={{ color: 'white' }}
      >
        {session.isRunning ? <Pause /> : <PlayArrow />}
      </IconButton>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleStop();
        }}
        sx={{ color: 'white' }}
      >
        <Stop />
      </IconButton>
    </Paper>
  );
};

export default MiniPlayer;