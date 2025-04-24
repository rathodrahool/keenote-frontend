import { Layout } from './components/layout/Layout';
import { CategoryProvider } from './context/CategoryContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { CategoriesPage } from './features/categories/pages/CategoriesPage';
import { TasksPage } from './features/tasks/pages/TasksPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotFound } from './components/pages/NotFound';
import { RouteGuard } from './components/guards/RouteGuard';
import { ToastContainer } from './components/common/Toast';

export const App = () => {
  return (
    <Router>
      <ToastProvider>
        <CategoryProvider>
          <TaskProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/tasks" replace />} />
                <Route path="/tasks" element={
                  <RouteGuard>
                    <TasksPage />
                  </RouteGuard>
                } />
                <Route path="/categories" element={
                  <RouteGuard>
                    <CategoriesPage />
                  </RouteGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <ToastContainer />
          </TaskProvider>
        </CategoryProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
