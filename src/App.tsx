import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import MyRecipes from './pages/MyRecipes';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="recipes">
          <Route index element={<MyRecipes />} />
          <Route path="create" element={<CreateRecipe />} />
          <Route path=":id" element={<RecipeDetails />} />
          <Route path=":id/edit" element={<EditRecipe />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;