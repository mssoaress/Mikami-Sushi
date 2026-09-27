import { useCallback, useMemo, useState } from 'react';

const STORAGE_KEY = 'mikamiCart';
export const MAX_ITEM_QUANTITY = 99;

export function normalizeCart(value) {
  if (!Array.isArray(value)) return [];

  const quantities = new Map();
  value.forEach((item) => {
    if (!item || (typeof item.id !== 'string' && typeof item.id !== 'number')) return;
    const id = String(item.id).trim();
    const quantity = Number(item.qty);
    if (!id || !Number.isInteger(quantity) || quantity <= 0) return;
    const nextQuantity = Math.min((quantities.get(id) || 0) + quantity, MAX_ITEM_QUANTITY);
    quantities.set(id, nextQuantity);
  });

  return [...quantities].map(([id, qty]) => ({ id, qty }));
}

function loadCart() {
  try {
    return normalizeCart(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // O carrinho segue funcionando na sessão quando o armazenamento é bloqueado.
  }
}

export function fmt(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,00';
}

export function useCart() {
  const [cart, setCart] = useState(loadCart);

  const persist = useCallback((updater) => {
    setCart((previous) => {
      const next = normalizeCart(typeof updater === 'function' ? updater(previous) : updater);
      saveCart(next);
      return next;
    });
  }, []);

  const addItem = useCallback((id) => {
    const normalizedId = String(id);
    persist((previous) => {
      const existing = previous.find((item) => item.id === normalizedId);
      if (!existing) return [...previous, { id: normalizedId, qty: 1 }];
      return previous.map((item) => item.id === normalizedId
        ? { ...item, qty: Math.min(item.qty + 1, MAX_ITEM_QUANTITY) }
        : item);
    });
  }, [persist]);

  const incItem = useCallback((id) => {
    const normalizedId = String(id);
    persist((previous) => previous.map((item) => item.id === normalizedId
      ? { ...item, qty: Math.min(item.qty + 1, MAX_ITEM_QUANTITY) }
      : item));
  }, [persist]);

  const decItem = useCallback((id) => {
    const normalizedId = String(id);
    persist((previous) => previous
      .map((item) => item.id === normalizedId ? { ...item, qty: item.qty - 1 } : item)
      .filter((item) => item.qty > 0));
  }, [persist]);

  const removeItems = useCallback((ids) => {
    const normalizedIds = new Set(ids.map(String));
    persist((previous) => previous.filter((item) => !normalizedIds.has(item.id)));
  }, [persist]);

  const clearCart = useCallback(() => persist([]), [persist]);
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  return { cart, addItem, incItem, decItem, removeItems, clearCart, count };
}
