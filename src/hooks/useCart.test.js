import { describe, expect, it } from 'vitest';
import { MAX_ITEM_QUANTITY, normalizeCart } from './useCart';

describe('normalizeCart', () => {
  it('mantém apenas IDs e quantidades inteiras positivas', () => {
    expect(normalizeCart([
      { id: 101, name: 'nome adulterado', price: -10, qty: 2 },
      { id: '', qty: 1 },
      { id: 102, qty: -1 },
      { id: 103, qty: 1.5 },
      null,
    ])).toEqual([{ id: '101', qty: 2 }]);
  });

  it('combina IDs repetidos e limita a quantidade máxima', () => {
    expect(normalizeCart([
      { id: '101', qty: 60 },
      { id: 101, qty: 60 },
    ])).toEqual([{ id: '101', qty: MAX_ITEM_QUANTITY }]);
  });

  it('recupera com segurança de valores que não são listas', () => {
    expect(normalizeCart(null)).toEqual([]);
    expect(normalizeCart({ id: 101, qty: 1 })).toEqual([]);
  });
});
