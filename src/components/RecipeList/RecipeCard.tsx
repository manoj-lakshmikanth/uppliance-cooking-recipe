import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Star, StarBorder, PlayArrow } from '@mui/icons-material';
import { useAppDispatch } from '../../store/hooks.ts';
import { toggleFavorite } from '../../store/recipesSlice.ts';
import type { Recipe } from '../../types';
import { calculateTotalTime } from '../../utils/calculations.ts';
import DifficultyChip from '../common/DifficultyChip';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const totalTime = calculateTotalTime(recipe.steps);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(recipe.id));
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s',
        },
      }}
      onClick={() => navigate(`/cook/${recipe.id}`)}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {recipe.title}
          </Typography>
          <IconButton size="small" onClick={handleFavoriteToggle}>
            {recipe.isFavorite ? <Star color="warning" /> : <StarBorder />}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <DifficultyChip difficulty={recipe.difficulty} />
          <Chip label={`${totalTime} min`} size="small" variant="outlined" />
          <Chip label={`${recipe.steps.length} steps`} size="small" variant="outlined" />
        </Box>

        {recipe.cuisine && (
          <Typography variant="body2" color="text.secondary">
            Cuisine: {recipe.cuisine}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <IconButton color="primary" size="large">
          <PlayArrow />
        </IconButton>
        <Typography variant="body2" color="primary">
          Start Cooking
        </Typography>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;