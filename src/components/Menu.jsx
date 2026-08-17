import { useEffect, useState } from 'react';
import MenuItem from './MenuItem';

export default function Menu({ onAdd, unavailable, menuItems = {}, categorias = [] }) {
  const [activeTab, setActiveTab] = useState(null);

  // Garante que a aba ativa sempre aponte pra uma categoria que existe,
  // mesmo antes dos produtos carregarem ou se a lista de categorias mudar.
  useEffect(() => {
    if (categorias.length && !categorias.includes(activeTab)) {
      setActiveTab(categorias[0]);
    }
  }, [categorias, activeTab]);

  if (!categorias.length) {
    return (
      <section className="menu" id="cardapio">
        <div className="container">
          <div className="section-header"><h2>Cardápio</h2></div>
        </div>
      </section>
    );
  }

  return (
    <section className="menu" id="cardapio">
      <div className="container">
        <div className="section-header">
          <h2>Cardápio</h2>
          <div className="tab-bar" role="tablist">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`tab-btn${activeTab === cat ? ' active' : ''}`}
                onClick={() => setActiveTab(cat)}
                role="tab"
                aria-selected={activeTab === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {categorias.map(cat => (
          <div
            key={cat}
            className={`menu-grid${activeTab === cat ? ' active' : ''}`}
            role="tabpanel"
          >
            {menuItems[cat]?.map(item => (
              <MenuItem key={item.id} item={item} onAdd={onAdd} unavailable={unavailable?.has(item.id)} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
