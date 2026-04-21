import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'farmer' ? '/dashboard' : '/market');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '80vh', padding: '2rem' }}>
      <div className="glass" style={{ width: '100%', maxWidth: 440, padding: '2.5rem' }}>
        <div className="text-center mb-xl">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌾</div>
          <h1 style={{ fontSize: '1.75rem' }}>Welcome Back</h1>
          <p className="text-muted mt-sm text-sm">Sign in to your FarmConnect account</p>
        </div>

        {error && <div className="alert alert-error mb-md">{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-md">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button id="login-submit-btn" type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔓 Sign In'}
          </button>
        </form>

        <div className="divider" />
        <p className="text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
