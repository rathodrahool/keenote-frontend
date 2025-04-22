import React from 'react';
import { Layout } from './components/layout/Layout';
import { CategoryProvider } from './context/CategoryContext';
import { ToastProvider } from './context/ToastContext';
import { CategoriesPage } from './features/categories/pages/CategoriesPage';

export const App = () => {
  return (
    <ToastProvider>
      <CategoryProvider>
        <Layout>
          <CategoriesPage />
        </Layout>
      </CategoryProvider>
    </ToastProvider>
  );
};

export default App;
