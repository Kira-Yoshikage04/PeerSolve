import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';
import { ModalProvider } from '../context/ModalContext';
import { ThemeProvider } from '../context/ThemeContext';

import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';

import LoginPage from './LoginPage';
import FeedPage from './FeedPage';
import DoubtPage from './DoubtPage';
import LeaderboardPage from './LeaderboardPage';
import NotFoundPage from './NotFoundPage';
import UserProfilePage from './UserProfilePage';
import AboutPage from './AboutPage';
import { Role } from '../types';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <ModalProvider>
            <HashRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<FeedPage />} />
                  <Route path="doubt/:id" element={<DoubtPage />} />
                  <Route path="leaderboard" element={<LeaderboardPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="profile" element={<UserProfilePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </HashRouter>
          </ModalProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;