import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    { icon: '🔐', title: 'Secure Sign-Up', desc: 'Create your account as a Farmer or Consumer in under a minute. Safe and simple.' },
    { icon: '🥦', title: 'List Your Harvest', desc: 'Farmers add produce with price, quantity, and expected harvest date. Easy as that.' },
    { icon: '📍', title: 'Shop Locally', desc: 'Discover fresh produce near you — filter by category, price, and availability.' },
    { icon: '🛒', title: 'Pre-Order Anytime', desc: 'Reserve fresh produce before it even hits the market. Lock in your order early.' },
    { icon: '📦', title: 'Track Your Order', desc: 'Watch your order move from packed → ready → shipped → at your door.' },
    { icon: '📊', title: 'Farmer Dashboard', desc: 'Manage all your listings and see incoming orders in one clean place.' },
  ];

  const howItWorks = [
    { step: '01', icon: '🌾', who: 'Farmer', action: 'Lists fresh produce', detail: 'A farmer in your area wakes up, harvests their crop, and lists it on FarmConnect — with a fair price, no middleman involved.' },
    { step: '02', icon: '🛍️', who: 'You', action: 'Browse & pre-order', detail: 'You browse the market, pick what looks good, and place a pre-order from your phone. No guessing, no overpaying.' },
    { step: '03', icon: '🚚', who: 'Delivery', action: 'Fresh at your door', detail: 'The farmer packs your order and ships it. You track every step — and the farmer earns what they deserve.' },
  ];

  const categoryEmojis = {
    Vegetables: '🥦', Fruits: '🍎', Grains: '🌾', Others: '🌿'
  };

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <h1>
          Farm Fresh, <span className="gradient-text">Delivered Direct</span>
        </h1>
        <p>
          No middlemen. No markups. Just real farmers, real food, and real people
          who care about where their meals come from.
        </p>
        <div className="flex flex-center gap-md">
          <Link to="/market" id="hero-shop-btn" className="btn btn-primary btn-lg">
            🛍️ Browse Market
          </Link>
          <Link to="/signup" id="hero-farmer-btn" className="btn btn-outline btn-lg">
            🌱 Join as Farmer
          </Link>
        </div>
      </section>

      <div className="page" style={{ paddingTop: 0 }}>

        {/* Tagline Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap',
          padding: '1.5rem 2rem',
          background: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.12)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-2xl)',
        }}>
          {[
            { icon: '🤝', text: 'Direct from Farmer' },
            { icon: '💰', text: 'Fair Prices Always' },
            { icon: '🌱', text: 'Freshness Guaranteed' },
            { icon: '📍', text: 'Hyperlocal Sourcing' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">Three simple steps between a farmer's field and your plate.</p>
        <div className="grid-3 mb-xl">
          {howItWorks.map((step, i) => (
            <div key={i} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Step number watermark */}
              <span style={{
                position: 'absolute', top: '0.75rem', right: '1rem',
                fontSize: '3.5rem', fontWeight: 900, opacity: 0.06, lineHeight: 1,
                color: 'var(--color-primary)',
              }}>{step.step}</span>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{step.icon}</div>
              <div style={{
                fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: '0.4rem',
              }}>
                {step.who} · Step {step.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{step.action}</h3>
              <p className="text-muted" style={{ lineHeight: 1.75, fontSize: '0.9rem' }}>
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Browse by Category */}
        <h2 className="section-title">What's in season?</h2>
        <p className="section-subtitle">Tap a category to explore what's fresh near you.</p>
        <div className="grid-4 mb-xl">
          {['Vegetables', 'Fruits', 'Grains', 'Others'].map(cat => (
            <Link
              to={`/market?category=${cat}`}
              key={cat}
              className="feature-card text-center"
              style={{ textDecoration: 'none' }}
            >
              <div className="feature-icon">{categoryEmojis[cat]}</div>
              <div className="feature-title">{cat}</div>
            </Link>
          ))}
        </div>

        {/* Features */}
        <h2 className="section-title">Everything you need</h2>
        <p className="section-subtitle">Built to make buying and selling local produce effortless.</p>
        <div className="grid-3">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
