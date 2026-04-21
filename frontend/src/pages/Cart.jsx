import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'consumer') {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Login Required</h3>
          <p>Please login as a consumer to manage your cart.</p>
          <Link to="/login" className="btn btn-primary mt-md">Login</Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setError('');
    setOrdering(true);
    try {
      const farmer = items[0].produce.farmer?._id || items[0].produce.farmer;
      // Smart orderType: pre-order if any item has pre-order status, otherwise instant
      const orderType = items.some(i => i.produce.status === 'pre-order') ? 'pre-order' : 'immediate';
      await axios.post('/api/orders', {
        items: items.map(i => ({ produce: i.produce._id, quantity: i.quantity, price: i.price })),
        farmer,
        totalPrice,
        orderType,
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Browse the market and add some fresh produce!</p>
          <Link to="/market" className="btn btn-primary mt-md">Browse Market</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="flex-between mb-xl">
        <h1 className="section-title" style={{ marginBottom: 0 }}>🛒 Your Cart</h1>
        <button id="clear-cart-btn" className="btn btn-danger btn-sm" onClick={clearCart}>Clear All</button>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
        {/* Items */}
        <div className="flex-col gap-md">
          {items.map(item => (
            <div key={item.produce._id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>
                {item.produce.category === 'Vegetables' ? '🥦' : item.produce.category === 'Fruits' ? '🍎' : item.produce.category === 'Grains' ? '🌾' : '🌿'}
              </span>
              <div style={{ flex: 1 }}>
                <div className="font-bold">{item.produce.name}</div>
                <div className="text-sm text-muted">
                  🌾 {item.produce.farmer?.name || 'Farmer'} · ₹{item.price}/{item.produce.unit}
                </div>
                <div className="flex gap-sm mt-sm" style={{ alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.produce._id, item.quantity - 1)}>−</button>
                  <span className="font-semibold" style={{ minWidth: 30, textAlign: 'center' }}>{item.quantity}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.produce._id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="font-bold" style={{ color: 'var(--color-primary-light)', fontSize: '1.1rem' }}>
                  ₹{(item.price * item.quantity).toFixed(0)}
                </div>
                <button id={`remove-${item.produce._id}`} className="btn btn-sm btn-danger mt-sm" onClick={() => removeItem(item.produce._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 className="mb-lg">Order Summary</h3>
          {items.map(item => (
            <div key={item.produce._id} className="flex-between text-sm mb-sm">
              <span>{item.produce.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
          <div className="divider" />
          <div className="flex-between font-bold text-lg">
            <span>Total</span>
            <span style={{ color: 'var(--color-primary-light)' }}>₹{totalPrice.toFixed(0)}</span>
          </div>
          {error && <div className="alert alert-error mt-md">{error}</div>}
          <button
            id="place-order-btn"
            className="btn btn-primary mt-lg"
            style={{ width: '100%' }}
            onClick={handlePlaceOrder}
            disabled={ordering}
          >
            {ordering ? '⏳ Placing Order...' : '✅ Place Order'}
          </button>
          <p className="text-sm text-muted text-center mt-md">
            Secure pre-order · No payment until delivery
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
