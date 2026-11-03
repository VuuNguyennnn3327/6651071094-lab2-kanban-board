import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { TaskProvider } from './context/TaskContext';
import { ToastContainer } from './components/ToastContainer';
import { ListPage } from './pages/ListPage';
import { DetailPage } from './pages/DetailPage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/item/:id" element={<DetailPage />} />
            {/* Fallback điều hướng về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </TaskProvider>
    </ToastProvider>
  );
};

export default App;
