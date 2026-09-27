import { useEffect, useRef, useState } from 'react';
import { fallbackToOriginalImage, optimizedImageSrc } from '../utils/optimizedImage';

const fmt = (value) => Number(value || 0).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function FeaturedProducts({
  onAdd,
  unavailable,
  items = [],
  title = 'Destaques da Mikami',
  eyebrow = 'Escolhas da casa',
  sectionIndex = '01',
  variant = 'collection',
  id,
}) {
  const [visible, setVisible] = useState([]);
  const refs = useRef([]);
  const supportsObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

  useEffect(() => {
    if (!supportsObserver) return undefined;
    const timers = [];
    const observers = refs.current.map((element, index) => {
      if (!element) return null;
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        const timer = window.setTimeout(() => {
          setVisible((previous) => [...new Set([...previous, items[index]?.id])]);
        }, index * 80);
        timers.push(timer);
        observer.disconnect();
      }, { threshold: 0.12 });
      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [items, supportsObserver]);

  if (!items.length) return null;

  return (
    <section className={`featured-section featured-section--${variant}`} id={id}>
      <div className="container">
        <div className="section-header section-header--editorial">
          <span className="section-index" aria-hidden="true">{sectionIndex}</span>
          <span className="section-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{variant === 'daily' ? 'Uma escolha especial para o seu pedido de hoje.' : 'Os sabores que melhor traduzem a nossa cozinha.'}</p>
        </div>

        <div className="featured-grid">
          {items.map((item, index) => {
            const isUnavailable = unavailable?.has(item.id);
            const isVisible = !supportsObserver || visible.includes(item.id);
            const imageSource = optimizedImageSrc(item.img);
            return (
              <article
                key={item.id}
                ref={(element) => { refs.current[index] = element; }}
                className={`feat-card${isVisible ? ' feat-card--visible' : ''}${isUnavailable ? ' feat-card--unavailable' : ''}`}
                style={{ '--fi': index }}
              >
                <div className="feat-img-wrap">
                  <img
                    src={imageSource}
                    alt={item.nome}
                    className="feat-img"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => fallbackToOriginalImage(event, item.img)}
                  />
                  <span className="feat-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span className="feat-tag">{item.tag || item.categoria}</span>
                  {isUnavailable && <span className="unavailable-badge">Indisponível</span>}
                  {!isUnavailable && item.estoque !== null && item.estoque !== undefined && (
                    <span className="estoque-badge">Restam {item.estoque}</span>
                  )}
                  <div className="feat-img-overlay" />
                </div>
                <div className="feat-body">
                  <h3 className="feat-name">{item.nome}</h3>
                  {item.descricao && <p className="feat-description">{item.descricao}</p>}
                  <div className="item-footer">
                    <span className="item-price">{fmt(item.preco)}</span>
                    <button
                      className={`btn-add${isUnavailable ? ' btn-add--disabled' : ''}`}
                      onClick={() => !isUnavailable && onAdd(item.id, item.nome, item.preco)}
                      disabled={isUnavailable}
                      aria-label={isUnavailable ? `${item.nome} indisponível` : `Adicionar ${item.nome}`}
                    >
                      <i className={`fas ${isUnavailable ? 'fa-ban' : 'fa-plus'}`} aria-hidden="true" />
                      <span>{isUnavailable ? 'Indisponível' : 'Adicionar'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
