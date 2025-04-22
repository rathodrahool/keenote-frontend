import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { CategoryProvider } from './context/CategoryContext';
import { ToastProvider } from './context/ToastContext';
import { CategoriesPage } from './features/categories/pages/CategoriesPage';

export const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <CategoryProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/categories" element={<CategoriesPage />} />
              {/* Add other routes as needed */}
            </Routes>
          </Layout>
        </CategoryProvider>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
