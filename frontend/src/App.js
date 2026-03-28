import React, { useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  if (!user) return <Login setUser={setUser} setRole={setRole} />;
  if (role === 'admin') return <AdminDashboard user={user} setUser={setUser} />;
  return <StudentDashboard user={user} setUser={setUser} />;
}