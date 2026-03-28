import React, { useState } from 'react';
import { API } from '../api';
import './Login.css';

export default function Login({ setUser, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === 'admin@sports.com' && password === 'admin123') {
      setUser({ name: 'Admin', email });
      setRole('admin');
      return;
    }
    try {
      const res = await API.students.post('/login', { email, password });
      if (res.data) { setUser(res.data); setRole('student'); }
      else setError('Invalid credentials');
    } catch { setError('Login failed. Check your credentials.'); }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">🏆</div>
        <h1>Sports Facility</h1>
        <p>Management System</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <div className="hint">
          <b>Admin:</b> admin@sports.com / admin123<br/>
          <b>Student:</b> rahul@email.com / pass123
        </div>
      </div>
    </div>
  );
}