import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const STATUS_STEPS = ['packed', 'ready', 'shipped', 'delivered'];

const getStepStatus = (orderStatus, step) => {
  const orderIdx = STATUS_STEPS.indexOf(orderStatus);
  const stepIdx = STATUS_STEPS.indexOf(step);
  if (stepIdx < orderIdx) return 'completed';
  if (stepIdx === orderIdx) return 'active';
  return '';
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const res = await axios.patch(`/api/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="page"><div className="empty-state"><Link to="/login" className="btn btn-primary">Login to view orders</Link></div></div>;

  return (
    <div className="page">
      <h1 className="section-title mb-xl">📦 {user.role === 'farmer' ? 'Incoming Orders' : 'My Orders'}</h1>

      {loading ? (
        <div className="loading-wrapper"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No orders yet</h3>
          <p>{user.role === 'consumer' ? 'Browse the market and place your first order!' : 'Orders from consumers will appear here.'}</p>
          {user.role === 'consumer' && <Link to="/market" className="btn btn-primary mt-md">Browse Market</Link>}
        </div>
      ) : (
        <div className="flex-col gap-lg">
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="flex-between mb-md">
                <div>
                  <div className="font-bold">Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div className="text-sm text-muted mt-sm">
                    📅 {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}
                    <span className={`badge ${order.orderType === 'pre-order' ? 'badge-yellow' : 'badge-green'}`}>
                      {order.orderType}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-bold" style={{ fontSize: '1.3rem', color: 'var(--color-primary-light)' }}>
                    ₹{order.totalPrice}
                  </div>
                  {user.role === 'farmer' && order.status !== 'delivered' && (
                    <select
                      id={`order-status-${order._id}`}
                      className="form-select mt-sm"
                      style={{ width: 'auto', fontSize: '0.8rem' }}
                      value={order.status}
                      onChange={e => handleStatusUpdate(order._id, e.target.value)}
                    >
                      {STATUS_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                      <option value="cancelled">cancelled</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="flex-col gap-sm mb-lg">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex-between text-sm" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span>{item.produce?.name || 'Produce'} × {item.quantity}</span>
                    <span className="text-muted">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Status Timeline */}
              {order.status !== 'cancelled' && (
                <div className="status-timeline">
                  {STATUS_STEPS.map((step, i) => {
                    const status = getStepStatus(order.status, step);
                    return (
                      <div key={step} className={`status-step ${status}`}>
                        <div className="status-dot">
                          {status === 'completed' ? '✓' : i + 1}
                        </div>
                        <span className="status-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {order.status === 'cancelled' && (
                <div className="badge badge-red">❌ Order Cancelled</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
