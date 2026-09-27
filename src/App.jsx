import { useCallback, useMemo, useState } from 'react';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useStoreStatus } from './hooks/useStoreStatus';
import { useProdutosSite } from './hooks/useProdutosSite';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import FeaturedProducts from './components/FeaturedProducts';
import ExperienceStrip from './components/ExperienceStrip';

export default function App() {
  const { cart: storedCart, addItem, incItem, decItem, removeItems, clearCart, count } = useCart();
  const { toasts, showToast } = useToast();
  const {
    isOpen: storeOpen,
    message: closedMessage,
    loading: storeLoading,
    error: storeError,
    retry: retryStoreStatus,
  } = useStoreStatus();
  const {
    products,
    menuItems,
    categorias,
    featured,
    destaqueDia,
    unavailable,
    loading: productsLoading,
    error: productsError,
    retry: retryProducts,
  } = useProdutosSite();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const productById = useMemo(
    () => new Map(products.map((product) => [String(product.id), product])),
    [products],
  );
  const cart = useMemo(() => storedCart.map((entry) => {
    const product = productById.get(entry.id);
    const price = Number(product?.preco);
    return {
      ...entry,
      name: product?.nome || 'Produto indisponível',
      price: Number.isFinite(price) && price >= 0 ? price : 0,
      invalid: !product,
    };
  }), [storedCart, productById]);
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  );

  function handleAdd(id, name) {
    addItem(id);
    showToast(`${name} adicionado`);
  }

  return (
    <>
      <Header count={count} onOpenCart={openDrawer} />

      <button
        className="cart-btn floating-cart"
        onClick={openDrawer}
        aria-label="Abrir carrinho"
      >
        <i className="fas fa-shopping-bag"></i>
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>

      <CartDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        cart={cart}
        subtotal={subtotal}
        onInc={incItem}
        onDec={decItem}
        onRemoveItems={removeItems}
        onClear={clearCart}
        showToast={showToast}
        storeOpen={storeOpen}
        closedMessage={closedMessage}
        storeLoading={storeLoading}
        storeError={storeError}
        onRetryStore={retryStoreStatus}
        productsLoading={productsLoading}
        productsError={productsError}
      />

  <main>
  <Hero storeOpen={storeOpen} storeLoading={storeLoading} storeError={storeError} onOpenCart={openDrawer} />
  <ExperienceStrip />
  <FeaturedProducts onAdd={handleAdd} unavailable={unavailable} items={destaqueDia} title="Destaque do Dia" eyebrow="Seleção de hoje" sectionIndex="01" variant="daily" />
  <Menu
    onAdd={handleAdd}
    unavailable={unavailable}
    menuItems={menuItems}
    categorias={categorias}
    loading={productsLoading}
    error={productsError}
    onRetry={retryProducts}
  />
  <FeaturedProducts id="destaques" onAdd={handleAdd} unavailable={unavailable} items={featured} title="Destaques da Mikami" eyebrow="Escolhas da casa" sectionIndex="03" variant="collection" />
  </main>

      <Footer />
      <ToastContainer toasts={toasts} />
    </>
  );
}
