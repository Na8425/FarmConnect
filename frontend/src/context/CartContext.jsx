import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'farmconnect_cart';

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (produce, quantity) => {
    setItems(prev => {
      const existing = prev.find(i => i.produce._id === produce._id);
      const maxStock = produce.quantity;
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map(i =>
          i.produce._id === produce._id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { produce, quantity: Math.min(quantity, maxStock), price: produce.price }];
    });
  };

  const removeItem = (produceId) => {
    setItems(prev => prev.filter(i => i.produce._id !== produceId));
  };

  const updateQuantity = (produceId, quantity) => {
    if (quantity <= 0) { removeItem(produceId); return; }
    setItems(prev => prev.map(i => {
      if (i.produce._id !== produceId) return i;
      const maxStock = i.produce.quantity;
      return { ...i, quantity: Math.min(quantity, maxStock) };
    }));
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
