import { Chip } from '@mui/material';
import type { Difficulty } from '../../types';

interface DifficultyChipProps {
  difficulty: Difficulty;
}

const DifficultyChip = ({ difficulty }: DifficultyChipProps) => {
  const colors = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'error',
  } as const;

  return (
    <Chip
      label={difficulty}
      color={colors[difficulty]}
      size="small"
    />
  );
};

export default DifficultyChip;