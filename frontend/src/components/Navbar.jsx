import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'navbar-link active' : 'navbar-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🌾 FarmConnect</Link>

      <ul className="navbar-links">
        <li><Link to="/market" className={isActive('/market')}>Market</Link></li>
        {user?.role === 'farmer' && (
          <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
        )}
        {user && (
          <li><Link to="/orders" className={isActive('/orders')}>My Orders</Link></li>
        )}
      </ul>

      <div className="navbar-actions">
        {user && user.role === 'consumer' && (
          <Link to="/cart" className="btn btn-ghost btn-sm cart-btn">
            🛒 Cart
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
        )}
        {user ? (
          <div className="flex gap-sm" style={{ alignItems: 'center' }}>
            <span className="text-sm text-muted">
              {user.role === 'farmer' ? '🌱' : '🛍️'} {user.name}
            </span>
            <button id="logout-btn" className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" id="nav-login-btn" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/signup" id="nav-signup-btn" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
