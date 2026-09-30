import { useId, useRef, useState } from 'react';
import MenuItem from './MenuItem';

export default function Menu({ onAdd, onView, unavailable, menuItems = {}, categorias = [], loading, error, onRetry }) {
  const [activeTab, setActiveTab] = useState(null);
  const tabRefs = useRef([]);
  const idPrefix = useId().replace(/:/g, '');
  const selectedTab = categorias.includes(activeTab) ? activeTab : categorias[0];

  function handleTabKeyDown(event, currentIndex) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % categorias.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + categorias.length) % categorias.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = categorias.length - 1;
    setActiveTab(categorias[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  }

  if (loading || error || !categorias.length) {
    return (
      <section className="menu" id="cardapio">
        <div className="container">
          <div className="section-header">
            <span className="section-index" aria-hidden="true">02</span>
            <span className="section-eyebrow">Escolha seus favoritos</span>
            <h2>Cardápio</h2>
            <p>Escolha seus favoritos e monte seu pedido.</p>
          </div>
          <div className="menu-state" role={error ? 'alert' : 'status'} aria-live="polite">
            {loading ? (
              <><span className="menu-spinner" aria-hidden="true" /> <p>Carregando cardápio…</p></>
            ) : error ? (
              <>
                <i className="fas fa-triangle-exclamation" aria-hidden="true" />
                <p>{error}</p>
                <button type="button" className="btn btn-outline" onClick={onRetry}>Tentar novamente</button>
              </>
            ) : (
              <p>O cardápio está temporariamente vazio.</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="menu" id="cardapio">
      <div className="container">
        <div className="section-header">
          <span className="section-index" aria-hidden="true">02</span>
          <span className="section-eyebrow">Escolha seus favoritos</span>
          <h2>Cardápio</h2>
          <p>Escolha seus favoritos e monte seu pedido.</p>
        </div>

        <div className="tab-bar-shell">
          <div className="tab-bar" role="tablist" aria-label="Categorias do cardápio">
            {categorias.map((cat, index) => (
              <button
                key={cat}
                ref={(element) => { tabRefs.current[index] = element; }}
                id={`${idPrefix}-tab-${index}`}
                className={`tab-btn${selectedTab === cat ? ' active' : ''}`}
                onClick={() => setActiveTab(cat)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                role="tab"
                aria-selected={selectedTab === cat}
                aria-controls={`${idPrefix}-panel-${index}`}
                tabIndex={selectedTab === cat ? 0 : -1}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {categorias.map((cat, index) => (
          <div
            key={cat}
            id={`${idPrefix}-panel-${index}`}
            className={`menu-grid${selectedTab === cat ? ' active' : ''}`}
            role="tabpanel"
            aria-labelledby={`${idPrefix}-tab-${index}`}
            hidden={selectedTab !== cat}
          >
            {menuItems[cat]?.map((item, itemIndex) => (
              <MenuItem key={item.id} item={item} itemIndex={itemIndex} onAdd={onAdd} onView={onView} unavailable={unavailable?.has(item.id)} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
