import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MembersPage from './pages/MembersPage';
import CollectPage from './pages/CollectPage';
import AboutPage from './pages/AboutPage';
import MessageBoardPage from './pages/MessageBoardPage';
import MemberDetailPage from './pages/MemberDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/members/:username" element={<MemberDetailPage />} />
                <Route path="/collect" element={<CollectPage />} />
                <Route path="/message-board" element={<MessageBoardPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>
            </Route>
            
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App; 