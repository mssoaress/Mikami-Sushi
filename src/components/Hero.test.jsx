import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Hero from './Hero';

describe('Hero', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn((query) => ({
      matches: query.includes('max-width') ? false : false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.IntersectionObserver = class {
      observe() {}
      disconnect() {}
    };
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
  });

  it('mantém o conteúdo sobre o vídeo responsivo e abre o carrinho', () => {
    const onOpenCart = vi.fn();
    const { container } = render(
      <Hero storeOpen storeLoading={false} storeError={null} onOpenCart={onOpenCart} />,
    );

    expect(screen.getByRole('heading', { name: /Sushi fresco/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /Ver cardápio/i })).toHaveAttribute('href', '#cardapio');
    expect(container.querySelector('video')).toHaveAttribute('src', expect.stringMatching(/backgroundp-c\.mp4$/));

    fireEvent.click(screen.getByRole('button', { name: /Abrir carrinho/i }));
    expect(onOpenCart).toHaveBeenCalledOnce();
  });
});
