import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { RecipeProvider } from './contexts/RecipeContext';
import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <RecipeProvider>
          <App />
        </RecipeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);