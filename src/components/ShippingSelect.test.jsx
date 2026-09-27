import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ShippingSelect from './ShippingSelect';

describe('ShippingSelect', () => {
  it('abre pelo teclado, seleciona uma opção e fecha com Escape', async () => {
    const user = userEvent.setup();
    const onShippingChange = vi.fn();
    render(<ShippingSelect onShippingChange={onShippingChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const option = screen.getByRole('option', { name: /Cecilia.*3,00/i });
    option.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveTextContent('Cecilia');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
