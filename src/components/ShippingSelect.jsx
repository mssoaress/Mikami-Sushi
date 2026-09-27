import { useEffect, useId, useRef, useState } from 'react';
import { SHIPPING_OPTIONS } from '../data/menuItems';

export default function ShippingSelect({ onShippingChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(SHIPPING_OPTIONS[0]);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const containerRef = useRef(null);
  const listboxId = useId();

  useEffect(() => {
    onShippingChange(selected);
  }, [selected, onShippingChange]);

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
    setIsOpen((previous) => !previous);
  }

  function openAndFocus(index) {
    setIsOpen(true);
    requestAnimationFrame(() => optionRefs.current[index]?.focus());
  }

  function handleTriggerKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const selectedIndex = SHIPPING_OPTIONS.findIndex((option) => option.value === selected.value);
      openAndFocus(event.key === 'ArrowDown'
        ? selectedIndex
        : (selectedIndex - 1 + SHIPPING_OPTIONS.length) % SHIPPING_OPTIONS.length);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  function handleSelect(option, returnFocus = true) {
    setSelected(option);
    setIsOpen(false);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleOptionKeyDown(event, index) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (index + direction + SHIPPING_OPTIONS.length) % SHIPPING_OPTIONS.length;
      optionRefs.current[nextIndex]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      optionRefs.current[event.key === 'Home' ? 0 : SHIPPING_OPTIONS.length - 1]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(SHIPPING_OPTIONS[index]);
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      setIsOpen(false);
      if (event.key === 'Escape') {
        event.preventDefault();
        triggerRef.current?.focus();
      }
    }
  }

  return (
    <div className={`custom-select${isOpen ? ' open' : ''}`} ref={containerRef}>
      <button
        className="custom-select__trigger"
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="custom-select__icon">{selected.icon}</span>
        <span className="custom-select__label">{selected.label}</span>
        <span className={`custom-select__price${selected.free ? ' free' : ''}`}>{selected.display}</span>
        <i className="fas fa-chevron-down custom-select__arrow"></i>
      </button>
      <ul className="custom-select__dropdown" id={listboxId} role="listbox" hidden={!isOpen}>
        {SHIPPING_OPTIONS.map((option, index) => (
          <li
            key={option.value}
            ref={(element) => { optionRefs.current[index] = element; }}
            className={`custom-select__option${selected.value === option.value ? ' selected' : ''}`}
            onClick={() => handleSelect(option)}
            onKeyDown={(event) => handleOptionKeyDown(event, index)}
            role="option"
            aria-selected={selected.value === option.value}
            tabIndex={isOpen && selected.value === option.value ? 0 : -1}
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
