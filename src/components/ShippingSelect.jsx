import { useState, useEffect, useRef } from 'react';
import { SHIPPING_OPTIONS } from '../data/menuItems';

export default function ShippingSelect({ onShippingChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(SHIPPING_OPTIONS[0]);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    onShippingChange(selected);
  }, [selected]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function handleToggle(e) {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }

  function handleSelect(option) {
    setSelected(option);
    setIsOpen(false);
  }

  return (
    <div className={`custom-select${isOpen ? ' open' : ''}`} ref={containerRef}>
      <button
        className="custom-select__trigger"
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        onClick={handleToggle}
      >
        <span className="custom-select__icon">{selected.icon}</span>
        <span className="custom-select__label">{selected.label}</span>
        <span className={`custom-select__price${selected.free ? ' free' : ''}`}>{selected.display}</span>
        <i className="fas fa-chevron-down custom-select__arrow"></i>
      </button>
      <ul className="custom-select__dropdown" ref={dropdownRef} role="listbox">
        {SHIPPING_OPTIONS.map(option => (
          <li
            key={option.value}
            className={`custom-select__option${selected.value === option.value ? ' selected' : ''}`}
            onClick={() => handleSelect(option)}
          >
            <span className="opt-icon">{option.icon}</span>
            <span className="opt-name">{option.label}</span>
            <span className={`opt-price${option.free ? ' free' : ''}`}>{option.display}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
