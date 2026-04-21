import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '5rem' }}>🌾</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>404</h1>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Page Not Found</h2>
      <p className="text-muted" style={{ maxWidth: 360 }}>
        Looks like this field hasn't been planted yet. The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-md mt-md">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
        <Link to="/" className="btn btn-primary">🏠 Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
