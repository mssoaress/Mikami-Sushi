import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function Header({ count, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="container header-container">
        <a href="#home" className="logo" aria-label="Mikami Sushi — início">
          <img src={logo} alt="Mikami Sushi" className="logo-img" />
          <span className="logo-text" aria-hidden="true"><strong>MIKAMI</strong><em>SUSHI</em></span>
        </a>
        <nav className="header-nav" aria-label="Navegação principal">
          <a href="#home">Início</a>
          <a href="#cardapio">Cardápio</a>
          <a href="#destaques">Destaques</a>
          <a href="https://www.instagram.com/mikamisushi/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </nav>
        <button className="cart-btn desktop-cart" onClick={onOpenCart} aria-label="Abrir carrinho">
          <i className="fas fa-shopping-bag"></i>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </div>
    </header>
  );
}
