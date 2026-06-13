function formatPrice(price) {
  if (price === 0) return 'Consulte';
  return 'R$ ' + price.toFixed(2).replace('.', ',');
}

export default function MenuItem({ item, onAdd }) {
  function handleAdd(e) {
    const card = e.currentTarget.closest('.menu-item');
    if (card) {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => (card.style.transform = ''), 160);
    }
    onAdd(item.id, item.name, item.price);
  }

  return (
    <article className="menu-item">
      <div className="item-image">
        <img src={item.img} alt={item.name} loading="lazy" />
      </div>
      <div className="item-content">
        <h3>{item.name}</h3>
        <p className="item-desc">{item.desc}</p>
        <div className="item-footer">
          <span className="item-price">{formatPrice(item.price)}</span>
          <button
            className="btn-add"
            onClick={handleAdd}
            aria-label={`Adicionar ${item.name}`}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </article>
  );
}
