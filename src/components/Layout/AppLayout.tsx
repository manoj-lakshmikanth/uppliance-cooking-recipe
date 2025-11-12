import { Box, Container } from '@mui/material';
import MiniPlayer from './MiniPlayer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 10 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
      <MiniPlayer />
    </Box>
  );
};

export default AppLayout;