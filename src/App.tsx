import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import RecipeList from './components/RecipeList/RecipeList';
import RecipeBuilder from './components/RecipeBuilder/RecipeBuilder';
import CookingPage from './components/CookingSession/CookingPage';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" replace />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/create" element={<RecipeBuilder />} />
        <Route path="/cook/:id" element={<CookingPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;