import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORY_EMOJIS = {
  Vegetables: '🥦', Fruits: '🍎', Grains: '🌾', Others: '🌿'
};

const Market = () => {
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addedIds, setAddedIds] = useState([]);
  const { addItem } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchProduce = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        const res = await axios.get('/api/produce', { params });
        setProduce(res.data);
      } catch (err) {
        console.error('Failed to fetch produce:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduce();
  }, [selectedCategory]);

  const handleAddToCart = (item) => {
    addItem(item, 1);
    setAddedIds(prev => [...prev, item._id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== item._id)), 1500);
  };

  const filtered = produce.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.farmer?.name || '').toLowerCase().includes(search.toLowerCase())) &&
    p.quantity > 0 && p.status !== 'sold out'
  );

  const getStatusBadge = (status) => {
    const map = {
      available: 'badge-green',
      'pre-order': 'badge-yellow',
      'sold out': 'badge-red'
    };
    return map[status] || 'badge-blue';
  };

  return (
    <div className="page">
      <div className="flex-between mb-md">
        <div>
          <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>🛍️ Local Market</h1>
          <p className="text-muted text-sm">{filtered.length} listings available near you</p>
        </div>
        {user?.role === 'farmer' && (
          <Link to="/dashboard" className="btn btn-primary btn-sm">+ Add Produce</Link>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar mb-lg">
        <input
          type="text"
          id="market-search"
          className="form-input"
          placeholder="🔍 Search produce or farmer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <div className="flex gap-sm">
          {['', 'Vegetables', 'Fruits', 'Grains', 'Others'].map(cat => (
            <button
              key={cat}
              id={`filter-${cat || 'all'}`}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat ? `${CATEGORY_EMOJIS[cat]} ${cat}` : '🌍 All'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-wrapper"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌿</div>
          <h3>No produce found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map(item => (
            <div key={item._id} className="produce-card">
              <div className="produce-card-img" style={item.images && item.images[0] ? { backgroundImage: `url(${item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`})`, backgroundSize: 'cover', backgroundPosition: 'center', fontSize: 0 } : {}}>
                {(!item.images || !item.images[0]) && (CATEGORY_EMOJIS[item.category] || '🌾')}
              </div>
              <div className="produce-card-body">
                <div className="flex-between">
                  <span className="produce-card-name">{item.name}</span>
                  <span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                </div>
                <div className="produce-card-farmer">
                  🌾 {item.farmer?.name || 'Unknown Farmer'}
                </div>
                {item.description && (
                  <p className="text-sm text-muted">{item.description}</p>
                )}
                <div className="produce-card-price">
                  ₹{item.price} <span className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>/ {item.unit}</span>
                </div>
                <div className="produce-card-meta">
                  <span>📦 {item.quantity} {item.unit} left</span>
                  <span>🗓️ {new Date(item.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                {user && user.role === 'consumer' && item.status !== 'sold out' && (
                  <button
                    id={`add-cart-${item._id}`}
                    className={`btn btn-sm mt-sm ${addedIds.includes(item._id) ? 'btn-outline' : 'btn-primary'}`}
                    style={{ width: '100%' }}
                    onClick={() => handleAddToCart(item)}
                  >
                    {addedIds.includes(item._id) ? '✅ Added!' : '🛒 Add to Cart'}
                  </button>
                )}
                {!user && (
                  <Link to="/login" className="btn btn-ghost btn-sm mt-sm" style={{ width: '100%', textAlign: 'center' }}>
                    Login to Pre-Order
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Market;
