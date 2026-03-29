import React, { useState } from 'react';
import { API } from '../api';
import './Login.css';

export default function SignUpPage({ onGoToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
  });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);

    const { name, email, password, phone, dateOfBirth } = formData;
    if (!name || !email || !password || !phone || !dateOfBirth) {
      setMessage('All fields are required!');
      return;
    }

    setLoading(true);
    try {
      await API.students.post('/signup', {
        name,
        email,
        password,
        phone,
        dateOfBirth,
      });
      setSuccess(true);
      setMessage('Account created successfully! You can now log in.');
      setFormData({ name: '', email: '', password: '', phone: '', dateOfBirth: '' });
    } catch (err) {
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || 'Signup failed. Try again.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{ width: '400px' }}>
        <div className="login-logo">🏆</div>
        <h1>Sports Facility</h1>
        <p>Create Student Account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            style={{ color: formData.dateOfBirth ? '#000' : '#aaa' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {message && (
            <p className={success ? 'success' : 'error'}>{message}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
          Already have an account?{' '}
          <span
            onClick={onGoToLogin}
            style={{ color: '#0f3460', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  );
}