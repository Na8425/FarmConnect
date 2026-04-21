import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const INITIAL_FORM = {
  name: '', category: 'Vegetables', description: '', price: '',
  quantity: '', unit: 'kg', harvestDate: '', status: 'available'
};

const CATEGORY_EMOJI = { Vegetables: '🥦', Fruits: '🍎', Grains: '🌾', Others: '🌿' };

const Dashboard = () => {
  const { user } = useAuth();
  const [produce, setProduce] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null); // null = adding, string = editing
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('listings');

  // ✅ ALL hooks must come before any conditional returns (Rules of Hooks)
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [produceRes, ordersRes] = await Promise.all([
        axios.get('/api/produce'),
        axios.get('/api/orders'),
      ]);
      // Filter only this farmer's produce
      const mine = produceRes.data.filter(p => p.farmer?._id === user?.id || p.farmer?._id === user?._id);
      setProduce(mine);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'farmer') {
      fetchDashboardData();
    }
  }, [fetchDashboardData, user]);

  // Guard placed AFTER all hooks
  if (!user || user.role !== 'farmer') return <Navigate to="/login" />;

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.patch(`/api/produce/${editingId}`, form);
        setSuccess('✅ Produce updated successfully!');
        setEditingId(null);
      } else {
        await axios.post('/api/produce', form);
        setSuccess('✅ Produce listed successfully!');
      }
      setForm(INITIAL_FORM);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save produce.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description || '',
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      harvestDate: item.harvestDate ? item.harvestDate.slice(0, 10) : '',
      status: item.status,
    });
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/produce/${id}`);
      setProduce(prev => prev.filter(p => p._id !== id));
      setSuccess('🗑️ Listing deleted.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete produce.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      const res = await axios.patch(`/api/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o));
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { value: produce.length, label: 'Active Listings', icon: '📋' },
    { value: produce.reduce((s, p) => s + p.quantity, 0), label: 'Total Stock', icon: '📦' },
    { value: `₹${produce.reduce((s, p) => s + p.price * p.quantity, 0).toLocaleString('en-IN')}`, label: 'Inventory Value', icon: '💰' },
    { value: orders.length, label: 'Orders Received', icon: '🛒' },
  ];

  const STATUS_STEPS = ['packed', 'ready', 'shipped', 'delivered'];

  return (
    <div className="page">
      <div className="flex-between mb-xl">
        <div>
          <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>🌾 Farmer Dashboard</h1>
          <p className="text-muted text-sm">Welcome back, {user.name}!</p>
        </div>
        <div className="flex gap-sm">
          <span className="badge badge-green">Farmer Account</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-xl">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-sm mb-xl">
        {['listings', 'add', 'orders'].map(tab => (
          <button
            key={tab}
            id={`tab-${tab}`}
            className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setActiveTab(tab); if (tab !== 'add') handleCancelEdit(); }}
          >
            {tab === 'listings' ? '📋 My Listings' : tab === 'add' ? (editingId ? '✏️ Edit Produce' : '➕ Add Produce') : `📦 Orders (${orders.length})`}
          </button>
        ))}
      </div>

      {/* ADD / EDIT PRODUCE FORM */}
      {activeTab === 'add' && (
        <div className="glass" style={{ padding: '2rem', maxWidth: 600 }}>
          <h2 className="section-title">{editingId ? '✏️ Edit Produce' : 'Add New Produce'}</h2>
          {error && <div className="alert alert-error mb-md">{error}</div>}
          {success && <div className="alert alert-success mb-md">{success}</div>}

          <form onSubmit={handleSubmit} className="flex-col gap-md">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Produce Name</label>
                <input id="produce-name" name="name" className="form-input" placeholder="e.g. Organic Carrots"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select id="produce-category" name="category" className="form-select" value={form.category} onChange={handleChange}>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                  <option>Others</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input name="description" className="form-input" placeholder="Brief description..."
                value={form.description} onChange={handleChange} />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input id="produce-price" type="number" name="price" className="form-input"
                  placeholder="0" value={form.price} onChange={handleChange} required min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input id="produce-quantity" type="number" name="quantity" className="form-input"
                  placeholder="0" value={form.quantity} onChange={handleChange} required min={1} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select name="unit" className="form-select" value={form.unit} onChange={handleChange}>
                  <option value="kg">kg</option>
                  <option value="g">grams</option>
                  <option value="dozen">dozen</option>
                  <option value="piece">piece</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Harvest Date</label>
                <input id="produce-harvest-date" type="date" name="harvestDate" className="form-input"
                  value={form.harvestDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Listing Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  <option value="available">Available</option>
                  <option value="pre-order">Pre-Order</option>
                  <option value="sold out">Sold Out</option>
                </select>
              </div>
            </div>

            <div className="flex gap-sm">
              <button id="add-produce-btn" type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '⏳ Saving...' : editingId ? '💾 Save Changes' : '🌾 List Produce'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-ghost" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* MY LISTINGS */}
      {activeTab === 'listings' && (
        loading ? (
          <div className="loading-wrapper"><div className="spinner" /></div>
        ) : produce.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <h3>No listings yet</h3>
            <p>Add your first produce to start selling!</p>
            <button className="btn btn-primary mt-md" onClick={() => setActiveTab('add')}>
              + Add Produce
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            {produce.map(item => (
              <div key={item._id} className="card" style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>
                  {CATEGORY_EMOJI[item.category] || '🌿'}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <span className="font-bold text-lg">{item.name}</span>
                    <span className={`badge ${item.status === 'available' ? 'badge-green' : item.status === 'pre-order' ? 'badge-yellow' : 'badge-red'}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex gap-lg mt-sm text-sm text-muted">
                    <span>💰 ₹{item.price}/{item.unit}</span>
                    <span>📦 {item.quantity} {item.unit} in stock</span>
                    <span>🗓️ Harvest: {new Date(item.harvestDate).toLocaleDateString('en-IN')}</span>
                    <span>📂 {item.category}</span>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-sm">
                  <button
                    id={`edit-produce-${item._id}`}
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleEdit(item)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    id={`delete-produce-${item._id}`}
                    className="btn btn-sm btn-danger"
                    disabled={deletingId === item._id}
                    onClick={() => handleDelete(item._id)}
                  >
                    {deletingId === item._id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* INCOMING ORDERS */}
      {activeTab === 'orders' && (
        loading ? (
          <div className="loading-wrapper"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No orders yet</h3>
            <p>Orders from consumers will appear here.</p>
          </div>
        ) : (
          <div className="flex-col gap-lg">
            {orders.map(order => (
              <div key={order._id} className="card">
                <div className="flex-between mb-md">
                  <div>
                    <div className="font-bold">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="text-sm text-muted mt-sm">
                      👤 {order.consumer?.name || 'Consumer'} · {order.consumer?.email || ''}
                    </div>
                    <div className="text-sm text-muted">
                      📅 {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-bold" style={{ fontSize: '1.3rem', color: 'var(--color-primary-light)' }}>
                      ₹{order.totalPrice}
                    </div>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <select
                        id={`order-status-${order._id}`}
                        className="form-select mt-sm"
                        style={{ width: 'auto', fontSize: '0.8rem' }}
                        value={order.status}
                        onChange={e => handleOrderStatusUpdate(order._id, e.target.value)}
                      >
                        {STATUS_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="cancelled">cancelled</option>
                      </select>
                    )}
                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                      <span className={`badge mt-sm ${order.status === 'delivered' ? 'badge-green' : 'badge-red'}`}>
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>
                {/* Items */}
                <div className="flex-col gap-sm">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex-between text-sm" style={{ padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                      <span>{item.produce?.name || 'Produce'} × {item.quantity}</span>
                      <span className="text-muted">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
