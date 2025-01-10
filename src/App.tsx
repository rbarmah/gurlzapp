import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Health from './pages/Health';
import Physical from './pages/Physical';
import Mental from './pages/Mental';
import Fashion from './pages/Fashion';
import Chat from './pages/Chat';
import Marketplace from './pages/Marketplace';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/health" element={<Health />} />
            <Route path="/physical/*" element={<Physical />} />
            <Route path="/mental/*" element={<Mental />} />
            <Route path="/fashion" element={<Fashion />} />
            <Route path="/chat/*" element={<Chat />} />
            <Route path="/marketplace/*" element={<Marketplace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;