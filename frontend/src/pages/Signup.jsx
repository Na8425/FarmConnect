import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'consumer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!form.name.trim()) {
      setError('Please enter your full name.');
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
      const res = await axios.post('/api/auth/signup', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'farmer' ? '/dashboard' : '/market');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '80vh', padding: '2rem' }}>
      <div className="glass" style={{ width: '100%', maxWidth: 480, padding: '2.5rem' }}>
        <div className="text-center mb-xl">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌱</div>
          <h1 style={{ fontSize: '1.75rem' }}>Join FarmConnect</h1>
          <p className="text-muted mt-sm text-sm">Create your account and start today</p>
        </div>

        {/* Role Selector */}
        <div className="grid-2 mb-xl" style={{ gap: '0.75rem' }}>
          {[
            { value: 'consumer', icon: '🛍️', label: 'Consumer', desc: 'Browse & pre-order fresh produce' },
            { value: 'farmer', icon: '🌾', label: 'Farmer', desc: 'List and sell your harvest' },
          ].map(role => (
            <button
              key={role.value}
              type="button"
              id={`role-${role.value}-btn`}
              onClick={() => setForm(prev => ({ ...prev, role: role.value }))}
              className="card"
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: '1.25rem',
                borderColor: form.role === role.value ? 'var(--color-primary)' : undefined,
                background: form.role === role.value ? 'var(--color-primary-glow)' : undefined,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{role.icon}</div>
              <div style={{ fontWeight: 700 }}>{role.label}</div>
              <div className="text-sm text-muted mt-sm">{role.desc}</div>
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error mb-md">{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-md">
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <input id="signup-name" type="text" name="name" className="form-input"
              placeholder="Your name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email Address</label>
            <input id="signup-email" type="email" name="email" className="form-input"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" name="password" className="form-input"
              placeholder="Minimum 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button id="signup-submit-btn" type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Creating account...' : `✅ Create ${form.role === 'farmer' ? 'Farmer' : 'Consumer'} Account`}
          </button>
        </form>

        <div className="divider" />
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
