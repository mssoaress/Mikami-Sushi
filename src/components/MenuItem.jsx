function formatPrice(price) {
  if (price === 0) return 'Consulte';
  return 'R$ ' + price.toFixed(2).replace('.', ',');
}

export default function MenuItem({ item, onAdd, unavailable }) {
  function handleAdd(e) {
    if (unavailable) return;
    const card = e.currentTarget.closest('.menu-item');
    if (card) {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => (card.style.transform = ''), 160);
    }
    onAdd(item.id, item.name, item.price);
  }

  return (
    <article className={`menu-item${unavailable ? ' menu-item--unavailable' : ''}`}>
      <div className="item-image">
        <img src={item.img} alt={item.name} loading="lazy" />
        {unavailable && <span className="unavailable-badge">Indisponível</span>}
      </div>
      <div className="item-content">
        <h3>{item.name}</h3>
        <p className="item-desc">{item.desc}</p>
        <div className="item-footer">
          <span className="item-price">{formatPrice(item.price)}</span>
          <button
            className={`btn-add${unavailable ? ' btn-add--disabled' : ''}`}
            onClick={handleAdd}
            disabled={unavailable}
            aria-label={unavailable ? `${item.name} indisponível` : `Adicionar ${item.name}`}
          >
            <i className={`fas ${unavailable ? 'fa-ban' : 'fa-plus'}`}></i>
          </button>
        </div>
      </div>
    </article>
  );
}
