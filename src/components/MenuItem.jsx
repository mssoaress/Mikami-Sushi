import { fallbackToOriginalImage, optimizedImageSrc } from '../utils/optimizedImage';

function formatPrice(price) {
  if (!price) return 'Consulte';
  return 'R$ ' + Number(price).toFixed(2).replace('.', ',');
}

export default function MenuItem({ item, itemIndex = 0, onAdd, onView, unavailable }) {
  const imageSource = optimizedImageSrc(item.img);

  function handleAdd(e) {
    if (unavailable) return;
    const card = e.currentTarget.closest('.menu-item');
    if (card) {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => (card.style.transform = ''), 160);
    }
    onAdd(item.id, item.nome, item.preco);
  }

  return (
    <article className={`menu-item${unavailable ? ' menu-item--unavailable' : ''}`} style={{ '--item-index': itemIndex }}>
      <div className="item-image">
        <img
          src={imageSource}
          alt={item.nome}
          loading="lazy"
          decoding="async"
          onError={(event) => fallbackToOriginalImage(event, item.img)}
        />
        {unavailable && <span className="unavailable-badge">Indisponível</span>}
        {!unavailable && (item.estoque !== null && item.estoque !== undefined) && (
          <span className="estoque-badge">Restam {item.estoque}</span>
        )}
      </div>
      <div className="item-content">
        <span className="item-number" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>
        <h3>{item.nome}</h3>
        <p className="item-desc">{item.descricao}</p>
        <div className="item-footer">
          <span className="item-price">{formatPrice(item.preco)}</span>
          <button
            className={`btn-add${unavailable ? ' btn-add--disabled' : ''}`}
            onClick={handleAdd}
            disabled={unavailable}
            aria-label={unavailable ? `${item.nome} indisponível` : `Adicionar ${item.nome}`}
          >
            <i className={`fas ${unavailable ? 'fa-ban' : 'fa-plus'}`}></i>
            <span>{unavailable ? 'Indisponível' : 'Adicionar'}</span>
          </button>
        </div>
      </div>
      <button type="button" className="product-card-open" onClick={() => onView?.(item)} aria-label={`Ver detalhes de ${item.nome}`} />
    </article>
  );
}
