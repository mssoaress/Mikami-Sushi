import { useEffect, useRef, useState } from 'react';
import { detailImageSrc, fallbackToOriginalImage } from '../utils/optimizedImage';

const focusableSelector = [
  'button:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function formatPrice(price) {
  const value = Number(price);
  if (!Number.isFinite(value) || value <= 0) return 'Consulte';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ProductModal({ item, unavailable, onClose, onAdd }) {
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const imageButtonRef = useRef(null);
  const lightboxRef = useRef(null);
  const lightboxCloseRef = useRef(null);

  useEffect(() => {
    if (!item) return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [item]);

  useEffect(() => {
    if (!item) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (zoomed) {
          setZoomed(false);
          requestAnimationFrame(() => imageButtonRef.current?.focus());
        } else {
          onClose();
        }
        return;
      }

      if (event.key !== 'Tab') return;
      const scope = zoomed ? lightboxRef.current : dialogRef.current;
      const focusable = [...(scope?.querySelectorAll(focusableSelector) || [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, zoomed]);

  useEffect(() => {
    if (zoomed) requestAnimationFrame(() => lightboxCloseRef.current?.focus());
  }, [zoomed]);

  if (!item) return null;

  const detailSource = detailImageSrc(item.img);
  const category = item.tag || item.categoria || 'Mikami Sushi';

  function handleAdd() {
    if (unavailable) return;
    onAdd(item.id, item.nome, item.preco);
    onClose();
  }

  return (
    <div
      className="product-modal-overlay"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        ref={dialogRef}
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        aria-describedby="product-modal-description"
        aria-hidden={zoomed || undefined}
      >
        <button ref={closeRef} type="button" className="product-modal-close" onClick={onClose} aria-label="Fechar detalhes do produto">
          <i className="fas fa-xmark" aria-hidden="true" />
        </button>

        <div className="product-modal-media">
          <button
            ref={imageButtonRef}
            type="button"
            className="product-modal-image-button"
            onClick={() => setZoomed(true)}
            aria-label={`Ampliar imagem de ${item.nome}`}
          >
            <img
              src={detailSource}
              alt={item.nome}
              decoding="async"
              onError={(event) => fallbackToOriginalImage(event, item.img)}
            />
            <span className="product-modal-zoom-hint"><i className="fas fa-expand" aria-hidden="true" /> Ampliar imagem</span>
          </button>
        </div>

        <div className="product-modal-content">
          <span className="product-modal-category">{category}</span>
          <h2 id="product-modal-title">{item.nome}</h2>
          <p id="product-modal-description">{item.descricao || 'Uma seleção especial da cozinha Mikami.'}</p>

          {item.estoque !== null && item.estoque !== undefined && !unavailable && (
            <span className="product-modal-stock">Restam {item.estoque} unidades</span>
          )}

          <div className="product-modal-purchase">
            <span className="product-modal-price">{formatPrice(item.preco)}</span>
            <button
              type="button"
              className="product-modal-add"
              onClick={handleAdd}
              disabled={unavailable}
            >
              <i className={`fas ${unavailable ? 'fa-ban' : 'fa-plus'}`} aria-hidden="true" />
              {unavailable ? 'Produto indisponível' : 'Adicionar ao carrinho'}
            </button>
          </div>
        </div>
      </section>

      {zoomed && (
        <div
          ref={lightboxRef}
          className="product-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${item.nome}`}
          onMouseDown={(event) => { if (event.target === event.currentTarget) setZoomed(false); }}
        >
          <button ref={lightboxCloseRef} type="button" className="product-lightbox-close" onClick={() => setZoomed(false)} aria-label="Fechar imagem ampliada">
            <i className="fas fa-xmark" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="product-lightbox-image"
            onClick={() => setZoomed(false)}
            aria-label={`Imagem ampliada de ${item.nome}; toque para fechar`}
          >
            <img
              src={detailSource}
              alt={item.nome}
              onError={(event) => fallbackToOriginalImage(event, item.img)}
            />
          </button>
          <span className="product-lightbox-caption">{item.nome} · toque para fechar</span>
        </div>
      )}
    </div>
  );
}
