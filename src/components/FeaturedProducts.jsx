import { useEffect, useRef, useState } from 'react';

const FEATURED = [
  { id: 307, name: "Mikami Supremo 500g",           price: 55.0, img: "/img/especiais/mikamisupremo.jpeg",          tag: "Especial" },
  { id: 305, name: "Joe",                            price: 18.0, img: "/img/especiais/joeespecial.jpeg",            tag: "Especial" },
  { id: 101, name: "Temaki + Hot Roll",              price: 37.0, img: "/img/combos/combo1.jpeg",                    tag: "Combo" },
  { id: 105, name: "Joe + Niguiri + Mix",            price: 46.0, img: "/img/combos/combo5.jpeg",                    tag: "Combo" },
  { id: 210, name: "Poke 500ml",                     price: 37.0, img: "/img/individuais/poke.jpeg",                 tag: "Individual" },
  { id: 207, name: "Hot Dog Salmão",                 price: 30.0, img: "/img/individuais/sushidog.jpg",              tag: "Individual" },
  { id: 401, name: "Temaki de Copo — Salmão",        price: 28.0, img: "/img/temakis/temakicopo.jpg",                tag: "Temaki" },
  { id: 405, name: "Temaki de Camarão",              price: 30.0, img: "/img/temakis/temakicamarao.jpeg",            tag: "Temaki" },
  { id: 501, name: "Yakisoba Individual",            price: 20.0, img: "/img/yakisoba/yakisoba.jpg",                 tag: "Yakisoba" },
  { id: 502, name: "Yakisoba para 2 Pessoas",        price: 30.0, img: "/img/yakisoba/yakisobap2.png",               tag: "Yakisoba" },
  { id: 603, name: "Brownie com Sorvete",            price: 15.0, img: "/img/peçasdoces/browniecomsorvete.png",      tag: "Doce" },
  { id: 601, name: "Harumaki de Banana com Nutella", price: 20.0, img: "/img/peçasdoces/harumakinutela.jpg",         tag: "Doce" },
];

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function FeaturedProducts({ onAdd }) {
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
  }, []);

  return (
    <section className="featured-section">
      {/* Divisor superior igual ao da seção .menu */}
      <div className="featured-divider-top" />

      <div className="container">
        <div className="section-header">
          <h2>Destaques da Casa</h2>
        </div>

        <div className="featured-grid">
          {FEATURED.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => (refs.current[i] = el)}
              className={`feat-card ${visible.includes(i) ? 'feat-card--visible' : ''}`}
              style={{
                '--fi': i,
                '--float-dur': `${3.6 + (i % 4) * 0.4}s`,
                '--float-dist': `${5 + (i % 3) * 2}px`,
              }}
            >
              <div className="feat-img-wrap">
                <img src={item.img} alt={item.name} className="feat-img" loading="lazy" />
                <span className="feat-tag">{item.tag}</span>
                <div className="feat-img-overlay" />
              </div>
              <div className="feat-body">
                <h3 className="feat-name">{item.name}</h3>
                <div className="item-footer">
                  <span className="item-price">{fmt(item.price)}</span>
                  <button
                    className="btn-add"
                    onClick={() => onAdd(item.id, item.name, item.price)}
                    aria-label={`Adicionar ${item.name}`}
                  >
                    <i className="fas fa-plus" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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