import { useState, useCallback } from 'react';

const STORAGE_KEY = 'mikamiCart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function fmt(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

export function useCart() {
  const [cart, setCart] = useState(loadCart);

  const persist = useCallback((updater) => {
    setCart(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveCart(next);
      return next;
    });
  }, []);

  const addItem = useCallback((id, name, price) => {
    persist(prev => {
      const existing = prev.find(i => i.id == id);
      if (existing) {
        return prev.map(i => i.id == id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id, name, price: parseFloat(price), qty: 1 }];
    });
  }, [persist]);

  const incItem = useCallback((index) => {
    persist(prev => prev.map((item, i) => i === index ? { ...item, qty: item.qty + 1 } : item));
  }, [persist]);

  const decItem = useCallback((index) => {
    persist(prev => {
      const next = prev.map((item, i) => i === index ? { ...item, qty: item.qty - 1 } : item);
      return next.filter(item => item.qty > 0);
    });
  }, [persist]);

  const clearCart = useCallback(() => persist([]), [persist]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return { cart, addItem, incItem, decItem, clearCart, subtotal, count };
}
