import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ProductModal from './ProductModal';

const product = {
  id: 'combo-1',
  nome: 'Combo Mikami',
  descricao: 'Uma seleção especial.',
  preco: 42,
  categoria: 'Combos',
  estoque: 5,
  img: 'https://res.cloudinary.com/demo/image/upload/v1/combo.png',
};

describe('ProductModal', () => {
  it('amplia a imagem e adiciona o produto ao carrinho', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onClose = vi.fn();

    render(
      <ProductModal item={product} unavailable={false} onAdd={onAdd} onClose={onClose} />,
    );

    expect(screen.getByRole('dialog', { name: 'Combo Mikami' })).toBeVisible();
    expect(screen.getByText(/R\$\s*42,00/)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Ampliar imagem de Combo Mikami' }));
    expect(screen.getByRole('dialog', { name: 'Imagem ampliada de Combo Mikami' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Fechar imagem ampliada' }));
    expect(screen.queryByRole('dialog', { name: 'Imagem ampliada de Combo Mikami' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));
    expect(onAdd).toHaveBeenCalledWith('combo-1', 'Combo Mikami', 42);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('bloqueia a compra quando o produto está indisponível', () => {
    render(
      <ProductModal item={product} unavailable onAdd={vi.fn()} onClose={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Produto indisponível' })).toBeDisabled();
  });
});
