import React, { useState } from 'react';
import Login from './pages/Login';
import SignUpPage from './pages/SignUpPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState('login'); // 'login' | 'signup'

  if (!user) {
    if (page === 'signup') {
      return <SignUpPage onGoToLogin={() => setPage('login')} />;
    }
    return <Login setUser={setUser} setRole={setRole} onGoToSignup={() => setPage('signup')} />;
  }

  if (role === 'admin') return <AdminDashboard user={user} setUser={setUser} />;
  return <StudentDashboard user={user} setUser={setUser} />;
}