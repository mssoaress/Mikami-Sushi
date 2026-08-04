import { useState } from 'react';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useStoreStatus } from './hooks/useStoreStatus';
import { useUnavailableProducts } from './hooks/useUnavailableProducts';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import FeaturedProducts from './components/FeaturedProducts';

export default function App() {
  const { cart, addItem, incItem, decItem, clearCart, subtotal, count } = useCart();
  const { toasts, showToast } = useToast();
  const { isOpen: storeOpen, message: closedMessage } = useStoreStatus();
  const unavailable = useUnavailableProducts();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleAdd(id, name, price) {
    addItem(id, name, price);
    showToast(`${name} adicionado`);
  }

  return (
    <>
      <Header count={count} onOpenCart={() => setDrawerOpen(true)} />

      <button
        className="cart-btn floating-cart"
        onClick={() => setDrawerOpen(true)}
        aria-label="Abrir carrinho"
      >
        <i className="fas fa-shopping-bag"></i>
        <span className="cart-badge" style={{ opacity: count === 0 ? 0.4 : 1 }}>{count}</span>
      </button>

      <CartDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        subtotal={subtotal}
        onInc={incItem}
        onDec={decItem}
        onClear={clearCart}
        showToast={showToast}
        storeOpen={storeOpen}
        closedMessage={closedMessage}
      />

  <main>
  <Hero />
  <Menu onAdd={handleAdd} unavailable={unavailable} />
  <FeaturedProducts onAdd={handleAdd} unavailable={unavailable} />
  </main>

      <Footer />
      <ToastContainer toasts={toasts} />
    </>
  );
}
