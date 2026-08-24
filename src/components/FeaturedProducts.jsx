import { useEffect, useRef, useState } from 'react';

const fmt = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function FeaturedProducts({ onAdd, unavailable, items = [], title = 'Destaques da Mikami' }) {
  const [visible, setVisible] = useState([]);
  const refs = useRef([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible((prev) => [...new Set([...prev, i])]), i * 75);
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className="featured-section">
      {/* Divisor superior igual ao da seção .menu */}
      <div className="featured-divider-top" />

      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
        </div>

        <div className="featured-grid">
          {items.map((item, i) => {
            const isUnavailable = unavailable?.has(item.id);
            return (
              <div
                key={item.id}
                ref={(el) => (refs.current[i] = el)}
                className={`feat-card ${visible.includes(i) ? 'feat-card--visible' : ''}${isUnavailable ? ' feat-card--unavailable' : ''}`}
                style={{
                  '--fi': i,
                  '--float-dur': `${3.6 + (i % 4) * 0.4}s`,
                  '--float-dist': `${5 + (i % 3) * 2}px`,
                }}
              >
                <div className="feat-img-wrap">
                  <img src={item.img} alt={item.nome} className="feat-img" loading="lazy" />
                  <span className="feat-tag">{item.tag || item.categoria}</span>
                  {isUnavailable && <span className="unavailable-badge">Indisponível</span>}
                  {!isUnavailable && (item.estoque !== null && item.estoque !== undefined) && (
                    <span className="estoque-badge">Restam {item.estoque}</span>
                  )}
                  <div className="feat-img-overlay" />
                </div>
                <div className="feat-body">
                  <h3 className="feat-name">{item.nome}</h3>
                  <div className="item-footer">
                    <span className="item-price">{fmt(item.preco)}</span>
                    <button
                      className={`btn-add${isUnavailable ? ' btn-add--disabled' : ''}`}
                      onClick={() => !isUnavailable && onAdd(item.id, item.nome, item.preco)}
                      disabled={isUnavailable}
                      aria-label={isUnavailable ? `${item.nome} indisponível` : `Adicionar ${item.nome}`}
                    >
                      <i className={`fas ${isUnavailable ? 'fa-ban' : 'fa-plus'}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* ---- seção ---- */
        .featured-section {
          padding: 96px 0 120px;
          background: var(--bg-1);
          position: relative;
          overflow: hidden;
        }

        /* glow de fundo sutil */
        .featured-section::before {
          content: '';
          position: absolute;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(224,48,40,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        .featured-divider-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-2), transparent);
        }

        /* ---- grid ---- */
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        /* ---- card base ---- */
        .feat-card {
          background: var(--bg-3);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          opacity: 0;
          transform: translateY(36px) scale(0.97);
          transition:
            opacity 0.5s var(--ease) calc(var(--fi) * 0.06s),
            transform 0.5s var(--ease) calc(var(--fi) * 0.06s),
            border-color 0.25s var(--ease),
            box-shadow 0.25s var(--ease),
            background 0.25s var(--ease);
        }

        /* overlay de gradiente no card igual ao .menu-item */
        .feat-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--r-lg);
          background: linear-gradient(135deg, rgba(224,48,40,0.04), transparent 60%);
          opacity: 0;
          transition: opacity 0.28s var(--ease);
          pointer-events: none;
        }

        /* reveal */
        .feat-card--visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          animation: feat-float var(--float-dur) ease-in-out infinite;
          animation-delay: calc(var(--fi) * 0.15s);
        }

        @keyframes feat-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(calc(-1 * var(--float-dist))); }
        }

        /* hover pausa o float */
        .feat-card:hover {
          border-color: var(--border-r);
          background: var(--bg-4);
          box-shadow: var(--sh-md), 0 0 42px rgba(224,48,40,0.09);
          animation-play-state: paused;
          transform: translateY(-7px) scale(1.02);
          transition:
            transform 0.22s var(--ease-spring),
            box-shadow 0.22s var(--ease),
            border-color 0.22s var(--ease),
            background 0.22s var(--ease);
        }

        .feat-card:hover::after { opacity: 1; }

        /* ---- indisponível ---- */
        .feat-card--unavailable .feat-img {
          filter: grayscale(0.85) brightness(0.55);
        }
        .feat-card--unavailable .feat-name,
        .feat-card--unavailable .item-price {
          opacity: 0.5;
        }
        .feat-card--unavailable:hover {
          transform: translateY(0) scale(1);
          box-shadow: none;
          border-color: var(--border);
          background: var(--bg-3);
          animation-play-state: running;
        }
        .feat-card--unavailable:hover::after { opacity: 0; }
        .feat-card--unavailable:hover .feat-img {
          transform: none;
        }

        /* ---- imagem ---- */
        .feat-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: var(--bg-2);
        }

        .feat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s var(--ease), filter 0.4s var(--ease);
          filter: brightness(0.88) saturate(1.1);
        }

        .feat-card:hover .feat-img {
          transform: scale(1.07);
          filter: brightness(1) saturate(1.2);
        }

        /* gradiente base da imagem — igual ao .item-image::after */
        .feat-img-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 55%;
          background: linear-gradient(to top, rgba(20,20,24,0.95), transparent);
          pointer-events: none;
        }

        /* tag de categoria */
        .feat-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(6, 6, 8, 0.78);
          color: var(--gold-text);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: var(--r-full);
          border: 1px solid rgba(200,169,106,0.28);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 1;
        }

        /* ---- body ---- */
        .feat-body {
          padding: 16px 18px 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .feat-name {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-1);
          margin: 0 0 14px;
          line-height: 1.25;
          flex: 1;
        }

        /* reutiliza .item-footer, .item-price, .btn-add do index.css */

        /* ---- responsivo ---- */
        @media (max-width: 1024px) {
          .featured-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 640px) {
          .featured-section { padding: 72px 0 96px; }
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .feat-name { font-size: 1rem; }
        }

        @media (max-width: 400px) {
          .featured-grid { gap: 7px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .feat-card--visible { animation: none !important; }
          .feat-card { transition: opacity 0.3s, transform 0.3s !important; }
        }
      `}</style>
    </section>
  );
}
