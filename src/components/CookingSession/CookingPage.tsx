import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import { PlayArrow, Pause, Stop, ArrowBack, Star, StarBorder } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  startSession,
  pauseSession,
  resumeSession,
  stopCurrentStep,
} from '../../store/sessionSlice';
import { toggleFavorite } from '../../store/recipesSlice';
import { useTimer } from '../../hooks/useTimer';
import { calculateTotalTime } from '../../utils/calculations';
import DifficultyChip from '../common/DifficultyChip';
import ActiveStepPanel from './ActiveStepPanel';
import Timeline from './Timeline';
import ProgressBar from './ProgressBar';

const CookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const recipe = useAppSelector((state) =>
    state.recipes.recipes.find((r) => r.id === id)
  );
  const { activeRecipeId, byRecipeId } = useAppSelector((state) => state.session);
  const session = id ? byRecipeId[id] : undefined;

  useTimer(id || null, recipe, session?.isRunning || false);

  useEffect(() => {
    if (!recipe) {
      navigate('/recipes');
    }
  }, [recipe, navigate]);

  if (!recipe || !id) return null;

  const totalTime = calculateTotalTime(recipe.steps);
  const isActive = activeRecipeId === id;

  const handleStart = () => {
    if (activeRecipeId && activeRecipeId !== id) {
      alert('Another session is already active. Please stop it first.');
      return;
    }
    dispatch(startSession({ recipeId: id, recipe }));
  };

  const handlePauseResume = () => {
    if (!session) return;
    if (session.isRunning) {
      dispatch(pauseSession(id));
    } else {
      dispatch(resumeSession(id));
    }
  };

  const handleStop = () => {
    dispatch(stopCurrentStep({ recipeId: id, recipe }));
  };

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/recipes')}>
          Back to Recipes
        </Button>
      </Box>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" mb={1}>
              {recipe.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <DifficultyChip difficulty={recipe.difficulty} />
              <Chip label={`${totalTime} minutes`} variant="outlined" />
              {recipe.cuisine && <Chip label={recipe.cuisine} variant="outlined" />}
            </Box>
          </Box>
          <IconButton onClick={handleFavoriteToggle}>
            {recipe.isFavorite ? <Star color="warning" fontSize="large" /> : <StarBorder fontSize="large" />}
          </IconButton>
        </Box>
      </Paper>

      {/* Control Buttons */}
      {!isActive && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={handleStart}
            fullWidth
          >
            Start Session
          </Button>
        </Box>
      )}

      {isActive && session && (
        <>
          <ActiveStepPanel recipe={recipe} session={session} />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={session.isRunning ? <Pause /> : <PlayArrow />}
              onClick={handlePauseResume}
              fullWidth
            >
              {session.isRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Stop />}
              onClick={handleStop}
              color="error"
            >
              STOP
            </Button>
          </Box>

          <ProgressBar recipe={recipe} session={session} />
        </>
      )}

      <Timeline recipe={recipe} currentStepIndex={session?.currentStepIndex} />
    </Box>
  );
};

export default CookingPage;