import { burgerGroups, burgerPicks, pizzaGroups, pizzaPicks } from './menu.js';

export const CART_STORAGE_KEY = 'slice-town-cart-v1';
export const MAX_QUANTITY = 99;
const catalog = new Map();
const register = item => {
  const key = `${item.name}-${item.size}`;
  catalog.set(key, { ...item, key });
};

[...pizzaGroups, ...burgerGroups].forEach(group => group.items.forEach(([name, , price, large]) => {
  register({ name, price, size: large === undefined ? 'One portion' : 'Regular' });
  if (large !== undefined) register({ name, price: large, size: 'Large' });
}));
[...pizzaPicks, ...burgerPicks].forEach(item => item.prices.forEach((price, index) => register({ name: item.name, price, size: index === 0 ? 'Regular' : 'Large' })));

export function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || 'null');
    if (saved?.version !== 1 || !Array.isArray(saved.items)) return [];
    const restored = new Map();
    saved.items.slice(0, 200).forEach(row => {
      const product = catalog.get(row?.key);
      if (!product || !Number.isInteger(row.quantity) || row.quantity < 1) return;
      const quantity = Math.min(MAX_QUANTITY, row.quantity + (restored.get(product.key)?.quantity || 0));
      restored.set(product.key, { ...product, quantity });
    });
    return [...restored.values()];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items: cart.map(({ key, quantity }) => ({ key, quantity })) }));
  } catch {
    // The order preview also works when browser storage is unavailable.
  }
}
