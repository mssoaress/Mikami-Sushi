export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="badge">Delivery &amp; Retirada</span>
          <h1>Sushi fresco,<br /><em>Experiência<br className="title-break" /> Mikami.</em></h1>
          <p className="hero-subtitle">Combos, temakis e sashimis com qualidade premium. Peça em minutos.</p>
          <div className="hero-info">
            <div className="info-chip">
              <i className="fas fa-clock"></i>
              <div>
                <strong>Hoje</strong>
                <span>18:00 – 23:30</span>
              </div>
            </div>
            <div className="info-chip">
              <i className="fas fa-location-dot"></i>
              <div>
                <strong>Local</strong>
                <span>Santa Cecília · Centro</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-logo-wrapper">
            <img src="/img/MIKAMI - SUSHI - PERFIL 2.png" alt="Mikami Sushi" className="hero-logo" />
          </div>
        </div>
      </div>
    </section>
  );
}
