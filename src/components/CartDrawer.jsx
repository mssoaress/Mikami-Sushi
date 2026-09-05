import { useState } from 'react';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { fmt } from '../hooks/useCart';
import { WHATSAPP_NUMBER, PIX_KEY } from '../data/menuItems';
import ShippingSelect from './ShippingSelect';

// Desconta o estoque de cada item do carrinho de forma atômica — usa uma
// transação do Firestore pra evitar que dois clientes comprando ao mesmo
// tempo "furem" o estoque (ex: só resta 1 e os dois conseguem levar).
// Produtos sem controle de estoque (campo estoque em branco/null) não são
// tocados. Se algum item não tiver mais quantidade suficiente, a
// transação inteira é cancelada e nada é descontado.
async function baixarEstoque(cart) {
  await runTransaction(db, async (transaction) => {
    const refs = cart.map(item => doc(db, 'produtos_site', String(item.id)));
    const snaps = await Promise.all(refs.map(ref => transaction.get(ref)));

    for (let i = 0; i < cart.length; i++) {
      const estoque = snaps[i].data()?.estoque;
      const controla = estoque !== null && estoque !== undefined;
      if (controla && estoque < cart[i].qty) {
        throw new Error(`Só restam ${estoque}x "${cart[i].name}" — ajuste a quantidade no carrinho.`);
      }
    }

    refs.forEach((ref, i) => {
      const estoque = snaps[i].data()?.estoque;
      const controla = estoque !== null && estoque !== undefined;
      if (controla) transaction.update(ref, { estoque: estoque - cart[i].qty });
    });
  });
}

export default function CartDrawer({ isOpen, onClose, cart, subtotal, onInc, onDec, onClear, showToast, storeOpen = true, closedMessage }) {
  const [shipping, setShipping] = useState({ price: 0, label: 'Retirada' });
  const [selectedPayment, setSelectedPayment] = useState('dinheiro');
  const [needsChange, setNeedsChange] = useState(null); // null | true | false
  const [changeFor, setChangeFor] = useState('');
  const [pixOpen, setPixOpen] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const total = subtotal + shipping.price;

  function buildWhatsAppMessage(method) {
    let paymentLine = method === 'pix'
      ? `Pix — Chave: ${PIX_KEY}`
      : 'Dinheiro em espécie';

    if (method === 'dinheiro') {
      if (needsChange === false) {
        paymentLine += ' — Sem troco';
      } else if (needsChange === true) {
        paymentLine += changeFor
          ? ` — Troco para R$ ${changeFor}`
          : ' — Precisa de troco (valor não informado)';
      }
    }

    let msg = '🍣 *NOVO PEDIDO — MIKAMI SUSHI* 🍣\n\n';
    msg += '*ITENS:*\n';
    cart.forEach(item => {
      msg += `• ${item.name} (${item.qty}x) — ${fmt(item.price * item.qty)}\n`;
    });
    msg += `\n📦 *Entrega:* ${shipping.label}`;
    msg += `\n💰 *Subtotal:* ${fmt(subtotal)}`;
    msg += `\n🚚 *Frete:* ${fmt(shipping.price)}`;
    msg += `\n💵 *Total:* ${fmt(total)}`;
    msg += `\n💳 *Pagamento:* ${paymentLine}`;
    msg += '\n\n👤 *Nome:* ';
    msg += '\n⏰ *Obs:* ';
    return msg;
  }

  async function sendToWhatsApp(method) {
    if (enviando) return;
    setEnviando(true);

    // Abre a aba já aqui, de forma síncrona, dentro do clique do usuário —
    // se esperarmos a baixa de estoque (await) pra só então chamar
    // window.open, navegadores como Safari/iOS não reconhecem mais isso
    // como resultado direto de um clique e bloqueiam a abertura, sem
    // avisar o cliente. Preenchemos a URL dessa aba depois que a baixa
    // de estoque terminar.
    const win = window.open('', '_blank');

    try {
      await baixarEstoque(cart);
    } catch (err) {
      if (win) win.close();
      showToast(err.message || 'Um item esgotou enquanto você comprava — ajuste o carrinho.');
      setEnviando(false);
      return;
    }

    const msg = buildWhatsAppMessage(method);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    if (win) {
      win.location.href = url;
    } else {
      // Fallback caso o navegador não tenha permitido nem a aba em branco
      // (ex: bloqueador de pop-up mais agressivo) — tenta abrir direto.
      window.open(url, '_blank');
    }
    setEnviando(false);
    onClose();
  }

  function handleCheckout() {
    if (cart.length === 0) { showToast('Carrinho vazio'); return; }
    if (!storeOpen) { showToast('No momento não estamos fazendo delivery'); return; }
    if (selectedPayment === 'pix') {
      onClose();
      setPixOpen(true);
    } else {
      sendToWhatsApp('dinheiro');
    }
  }

  function handleClear() {
    onClear();
    showToast('Carrinho limpo');
  }

  async function copyPix() {
    await navigator.clipboard.writeText(PIX_KEY);
    showToast('Chave copiada!');
  }

  function handleSelectPayment(method) {
    setSelectedPayment(method);
    if (method !== 'dinheiro') {
      setNeedsChange(null);
      setChangeFor('');
    }
  }

  return (
    <>
      <div className={`drawer-overlay${isOpen ? ' active' : ''}`} onClick={onClose}></div>

      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-label="Carrinho de compras">
        <div className="drawer-header">
          <h2>Seu pedido</h2>
          <button className="drawer-close" onClick={onClose} aria-label="Fechar carrinho">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="drawer-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-bag"></i>
              <p>Seu carrinho está vazio</p>
              <span>Adicione itens do cardápio</span>
            </div>
          ) : (
            cart.map((item, index) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>{fmt(item.price)} <span className="cart-item-unit">× {item.qty}</span> = <strong>{fmt(item.price * item.qty)}</strong></p>
                </div>
                <div className="cart-item-actions">
                  <button className="dec-item" onClick={() => onDec(index)} aria-label="Remover um">−</button>
                  <span>{item.qty}</span>
                  <button className="inc-item" onClick={() => onInc(index)} aria-label="Adicionar um">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawer-shipping">
          <div className="subtotal">
            <span>Subtotal</span>
            <strong>{fmt(subtotal)}</strong>
          </div>
          <div className="shipping-section">
            <h3><i className="fas fa-truck"></i> Entrega</h3>
            <ShippingSelect onShippingChange={setShipping} />
          </div>
        </div>

        <div className="drawer-footer">
          <div className="final-total">
            <span>Total</span>
            <strong>{fmt(total)}</strong>
          </div>

          {!storeOpen ? (
            <div className="store-closed-notice">
              <i className="fas fa-store-slash"></i>
              <p>{closedMessage}</p>
              <button className="btn btn-outline" onClick={handleClear}>
                <i className="fas fa-trash"></i> Limpar Carrinho
              </button>
            </div>
          ) : (
            <>
              <div className="payment-section">
                <h3><i className="fas fa-wallet"></i> Pagamento</h3>
                <div className="payment-options">
                  {['dinheiro', 'pix'].map(method => (
                    <button
                      key={method}
                      data-method={method}
                      className={`payment-option${selectedPayment === method ? ' active' : ''}`}
                      onClick={() => handleSelectPayment(method)}
                      aria-pressed={selectedPayment === method}
                    >
                      {method === 'dinheiro'
                        ? <><i className="fas fa-money-bill-wave"></i><span>Dinheiro</span></>
                        : <><i className="fa-brands fa-pix pix-logo"></i><span>Pix</span></>
                      }
                    </button>
                  ))}
                </div>

                {/* Bloco de troco — só aparece com dinheiro */}
                {selectedPayment === 'dinheiro' && (
                  <div className="change-box">
                    <p className="change-question">
                      <i className="fas fa-coins"></i> Precisa de troco?
                    </p>
                    <div className="change-options">
                      <button
                        className={`change-btn${needsChange === false ? ' change-btn--no' : ''}`}
                        onClick={() => { setNeedsChange(false); setChangeFor(''); }}
                      >
                        Não preciso
                      </button>
                      <button
                        className={`change-btn${needsChange === true ? ' change-btn--yes' : ''}`}
                        onClick={() => setNeedsChange(true)}
                      >
                        Sim, preciso
                      </button>
                    </div>

                    {needsChange === true && (
                      <div className="change-input-wrap">
                        <span className="change-prefix">R$</span>
                        <input
                          className="change-input"
                          type="number"
                          min={Math.ceil(total)}
                          placeholder={`Troco para quanto? (mín. R$ ${Math.ceil(total)})`}
                          value={changeFor}
                          onChange={e => setChangeFor(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="cart-actions">
                <button className="btn btn-primary" onClick={handleCheckout} disabled={enviando}>
                  <i className="fab fa-whatsapp"></i> {enviando ? 'Confirmando...' : 'Finalizar no WhatsApp'}
                </button>
                <button className="btn btn-outline" onClick={handleClear}>
                  <i className="fas fa-trash"></i> Limpar Carrinho
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Modal Pix */}
      {pixOpen && (
        <div className="pix-overlay active" role="dialog" aria-modal="true" onClick={e => { if (e.target.classList.contains('pix-overlay')) setPixOpen(false); }}>
          <div className="pix-modal">
            <button className="pix-close" onClick={() => setPixOpen(false)} aria-label="Fechar modal Pix">
              <i className="fas fa-times"></i>
            </button>
            <div className="pix-header">
              <div className="pix-header-icon"><i className="fas fa-qrcode"></i></div>
              <div>
                <h2>Pagar com Pix</h2>
                <p>Total: {fmt(total)}</p>
              </div>
            </div>
            <div className="pix-qr-wrapper">
              <img src="/img/qrcode.jpg" alt="QR Code Pix Mikami Sushi" className="pix-qr-img" />
              <p className="pix-qr-hint">Aponte a câmera para pagar</p>
            </div>
            <div className="pix-divider"><span>ou copie a chave</span></div>
            <div className="pix-key-wrapper">
              <span className="pix-key-value">{PIX_KEY}</span>
              <button className="pix-copy-btn" onClick={copyPix}>
                <i className="fas fa-copy"></i> Copiar
              </button>
            </div>
            <button className="btn btn-primary pix-confirm-btn" onClick={() => { setPixOpen(false); sendToWhatsApp('pix'); }} disabled={enviando}>
              <i className="fab fa-whatsapp"></i> {enviando ? 'Confirmando...' : 'Já paguei — Enviar pedido'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .store-closed-notice {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 18px 14px;
          background: var(--bg-3);
          border: 1px solid var(--red-border);
          border-radius: var(--r-md);
        }

        .store-closed-notice i {
          font-size: 1.4rem;
          color: var(--red);
        }

        .store-closed-notice p {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-1);
          line-height: 1.5;
          margin: 0;
        }

        .change-box {
          margin-top: 12px;
          background: var(--bg-3);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 13px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .change-question {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-2);
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0;
        }

        .change-question i {
          color: var(--gold);
          font-size: 0.82rem;
        }

        .change-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .change-btn {
          padding: 8px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border);
          background: var(--bg-4);
          color: var(--text-3);
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s var(--ease);
        }

        .change-btn:hover {
          border-color: var(--border-2);
          color: var(--text-1);
        }

        .change-btn--no {
          border-color: #4ade80;
          background: rgba(74, 222, 128, 0.08);
          color: #4ade80;
        }

        .change-btn--yes {
          border-color: var(--gold);
          background: var(--gold-soft);
          color: var(--gold-text);
        }

        .change-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-2);
          border: 1px solid var(--border-2);
          border-radius: var(--r-sm);
          padding: 9px 12px;
          transition: border-color 0.2s var(--ease);
        }

        .change-input-wrap:focus-within {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px var(--gold-soft);
        }

        .change-prefix {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--gold-text);
          flex-shrink: 0;
        }

        .change-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-1);
          width: 100%;
        }

        .change-input::placeholder {
          color: var(--text-4);
          font-weight: 400;
          font-size: 0.78rem;
        }

        /* remove setas do input number */
        .change-input::-webkit-outer-spin-button,
        .change-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .change-input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </>
  );
}