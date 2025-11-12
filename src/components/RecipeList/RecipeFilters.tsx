import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  type SelectChangeEvent,
} from '@mui/material';
import type { Difficulty } from '../../types';

interface RecipeFiltersProps {
  difficultyFilters: Difficulty[];
  setDifficultyFilters: (filters: Difficulty[]) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const RecipeFilters = ({
  difficultyFilters,
  setDifficultyFilters,
  sortOrder,
  setSortOrder,
}: RecipeFiltersProps) => {
  const handleDifficultyChange = (event: SelectChangeEvent<typeof difficultyFilters>) => {
    const value = event.target.value;
    setDifficultyFilters(typeof value === 'string' ? value.split(',') as Difficulty[] : value);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Filter by Difficulty</InputLabel>
        <Select
          multiple
          value={difficultyFilters}
          onChange={handleDifficultyChange}
          input={<OutlinedInput label="Filter by Difficulty" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {difficulties.map((difficulty) => (
            <MenuItem key={difficulty} value={difficulty}>
              {difficulty}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Sort by Time</InputLabel>
        <Select
          value={sortOrder}
          label="Sort by Time"
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <MenuItem value="asc">Shortest First</MenuItem>
          <MenuItem value="desc">Longest First</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default RecipeFilters;