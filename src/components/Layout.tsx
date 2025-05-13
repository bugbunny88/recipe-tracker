import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';

const Layout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'
      }`}>
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;