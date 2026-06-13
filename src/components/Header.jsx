export default function Header({ count, onOpenCart }) {
  return (
    <header className="header">
      <div className="container header-container">
        <a href="#home" className="logo">
          <img src="/img/headerlodo.jpg.png" alt="Mikami Sushi" className="logo-img" />
          <span className="logo-text">MIKAMI<span>SUSHI</span></span>
        </a>
        <button className="cart-btn desktop-cart" onClick={onOpenCart} aria-label="Abrir carrinho">
          <i className="fas fa-shopping-bag"></i>
          <span className="cart-badge" style={{ opacity: count === 0 ? 0.4 : 1 }}>{count}</span>
        </button>
      </div>
    </header>
  );
}
