import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Menu from './Menu';

const menuItems = {
  Combos: [{ id: '1', nome: 'Combo', descricao: 'Descrição', preco: 10, img: '/combo.jpg' }],
  Bebidas: [{ id: '2', nome: 'Água', descricao: 'Descrição', preco: 3, img: '/agua.jpg' }],
};

describe('Menu', () => {
  it('relaciona abas e painéis e permite navegar com as setas', async () => {
    const user = userEvent.setup();
    render(
      <Menu
        onAdd={vi.fn()}
        unavailable={new Set()}
        menuItems={menuItems}
        categorias={['Combos', 'Bebidas']}
      />,
    );

    const combosTab = screen.getByRole('tab', { name: 'Combos' });
    const drinksTab = screen.getByRole('tab', { name: 'Bebidas' });
    combosTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(drinksTab).toHaveFocus();
    expect(drinksTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Bebidas');

    const image = screen.getByRole('img', { name: 'Água' });
    expect(image).toHaveAttribute('src', '/agua.jpg');
  });

  it('otimiza imagens do Cloudinary e retorna ao original quando necessário', () => {
    const originalImage = 'https://res.cloudinary.com/demo/image/upload/v1/img/combo.png';
    const optimizedMenuItems = {
      Combos: [{ ...menuItems.Combos[0], img: originalImage }],
    };
    render(
      <Menu
        onAdd={vi.fn()}
        unavailable={new Set()}
        menuItems={optimizedMenuItems}
        categorias={['Combos']}
      />,
    );

    const image = screen.getByRole('img', { name: 'Combo' });
    expect(image).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:eco,w_900,c_limit/v1/img/combo.png',
    );
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', originalImage);
  });
});
