import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#home" className="footer-logo" aria-label="Mikami Sushi — início">
            <img src={logo} alt="" />
            <span>MIKAMI<strong>SUSHI</strong></span>
          </a>
          <p>Sushi preparado com cuidado, servido com a identidade Mikami.</p>
        </div>

        <div className="footer-column">
          <span className="footer-label">Visite</span>
          <p>Santa Cecília · Centro</p>
          <p>Delivery e retirada</p>
        </div>

        <div className="footer-column">
          <span className="footer-label">Navegue</span>
          <a href="#home">Início</a>
          <a href="#cardapio">Cardápio</a>
        </div>

        <div className="footer-column footer-social">
          <span className="footer-label">Acompanhe</span>
          <a href="https://www.instagram.com/mikamisushi/" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-instagram" aria-hidden="true" /> Instagram
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Mikami Sushi</p>
        <p>Santa Cecília, Pernambuco</p>
      </div>
    </footer>
  );
}
