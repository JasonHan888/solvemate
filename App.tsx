import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { ExplanationPage } from './pages/ExplanationPage';
import { LoginPage } from './pages/LoginPage';
import { SolverPage } from './pages/SolverPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Component
const ProtectedHistoryRoute = ({ children }: React.PropsWithChildren) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explanation" element={<ExplanationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<SolverPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route
        path="/history"
        element={
          <ProtectedHistoryRoute>
            <HistoryPage />
          </ProtectedHistoryRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedHistoryRoute>
            <ProfilePage />
          </ProtectedHistoryRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;