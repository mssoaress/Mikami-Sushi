import { useState } from 'react';
import { menuItems, TABS } from '../data/menuItems';
import MenuItem from './MenuItem';

export default function Menu({ onAdd }) {
  const [activeTab, setActiveTab] = useState('combos');

  return (
    <section className="menu" id="cardapio">
      <div className="container">
        <div className="section-header">
          <h2>Cardápio</h2>
          <div className="tab-bar" role="tablist">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {TABS.map(tab => (
          <div
            key={tab.key}
            className={`menu-grid${activeTab === tab.key ? ' active' : ''}`}
            id={`${tab.key}-items`}
            role="tabpanel"
          >
            {menuItems[tab.key]?.map(item => (
              <MenuItem key={item.id} item={item} onAdd={onAdd} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
