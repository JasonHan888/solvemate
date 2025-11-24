import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { SidebarLayout } from './components/SidebarLayout';
import { LandingPage } from './pages/LandingPage';
import { ExplanationPage } from './pages/ExplanationPage';
import { LoginPage } from './pages/LoginPage';
import { SolverPage } from './pages/SolverPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with Standard Layout */}
      <Route element={<Layout><Outlet /></Layout>}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explanation" element={<ExplanationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Routes with Sidebar Layout */}
      <Route element={<ProtectedRoute><SidebarLayout><Outlet /></SidebarLayout></ProtectedRoute>}>
        <Route path="/app" element={<SolverPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;