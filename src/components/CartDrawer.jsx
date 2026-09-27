import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { fmt, MAX_ITEM_QUANTITY } from '../hooks/useCart';
import { PIX_KEY, WHATSAPP_NUMBER } from '../data/menuItems';
import qrCode from '../assets/qrcode.jpg';
import ShippingSelect from './ShippingSelect';

const focusableSelector = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function useDialogFocus(open, onClose, dialogRef, initialFocusRef) {
  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => initialFocusRef.current?.focus());

    function handleKeyDown(event) {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = [...(dialogRef.current?.querySelectorAll(focusableSelector) || [])];
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose, dialogRef, initialFocusRef]);
}

async function validateOrder(cart) {
  const storeRequest = getDoc(doc(db, 'config', 'loja'));
  const productRequests = cart.map((item) => getDoc(doc(db, 'produtos_site', String(item.id))));
  const [storeSnapshot, ...productSnapshots] = await Promise.all([storeRequest, ...productRequests]);

  if (!storeSnapshot.exists()) {
    throw new Error('Não foi possível confirmar se a loja está aberta. Tente novamente.');
  }
  if (storeSnapshot.data().aberto === false) {
    throw new Error(storeSnapshot.data().motivo || 'No momento não estamos fazendo delivery.');
  }

  return cart.map((item, index) => {
    const snapshot = productSnapshots[index];
    if (!snapshot.exists()) throw new Error(`O item "${item.name}" não está mais no cardápio.`);

    const product = snapshot.data();
    const quantity = Number(item.qty);
    const price = Number(product.preco);
    const name = typeof product.nome === 'string' ? product.nome.trim() : '';
    const hasStockControl = product.estoque !== null && product.estoque !== undefined;
    const stock = Number(product.estoque);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      throw new Error('Há uma quantidade inválida no carrinho. Ajuste o pedido e tente novamente.');
    }
    if (!name || !Number.isFinite(price) || price < 0 || product.disponivel === false) {
      throw new Error(`O item "${item.name}" está indisponível no momento.`);
    }
    if (hasStockControl && (!Number.isFinite(stock) || stock < quantity)) {
      const available = Number.isFinite(stock) ? Math.max(0, stock) : 0;
      throw new Error(`Só restam ${available}x "${name}" — ajuste a quantidade no carrinho.`);
    }

    return { id: snapshot.id, name, price, qty: quantity };
  });
}

function buildOrder(items, shipping) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { items, shipping, subtotal, total: subtotal + shipping.price };
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  subtotal,
  onInc,
  onDec,
  onRemoveItems,
  onClear,
  showToast,
  storeOpen,
  closedMessage,
  storeLoading,
  storeError,
  onRetryStore,
  productsLoading,
  productsError,
}) {
  const [shipping, setShipping] = useState({ price: 0, label: 'Retirada' });
  const [selectedPayment, setSelectedPayment] = useState('dinheiro');
  const [needsChange, setNeedsChange] = useState(null);
  const [changeFor, setChangeFor] = useState('');
  const [pixOpen, setPixOpen] = useState(false);
  const [preparedOrder, setPreparedOrder] = useState(null);
  const [sending, setSending] = useState(false);
  const drawerRef = useRef(null);
  const drawerCloseRef = useRef(null);
  const pixRef = useRef(null);
  const pixCloseRef = useRef(null);
  const closePix = useCallback(() => setPixOpen(false), []);

  useDialogFocus(isOpen, onClose, drawerRef, drawerCloseRef);
  useDialogFocus(pixOpen, closePix, pixRef, pixCloseRef);

  const total = subtotal + shipping.price;
  const unavailableIds = cart.filter((item) => item.invalid).map((item) => item.id);

  function buildWhatsAppMessage(order, method) {
    let paymentLine = method === 'pix' ? `Pix — Chave: ${PIX_KEY}` : 'Dinheiro em espécie';
    if (method === 'dinheiro') {
      if (needsChange === false) paymentLine += ' — Sem troco';
      if (needsChange === true) paymentLine += ` — Troco para ${fmt(Number(changeFor))}`;
    }

    let message = '🍣 *NOVO PEDIDO — MIKAMI SUSHI* 🍣\n\n*ITENS:*\n';
    order.items.forEach((item) => {
      message += `• ${item.name} (${item.qty}x) — ${fmt(item.price * item.qty)}\n`;
    });
    message += `\n📦 *Entrega:* ${order.shipping.label}`;
    message += `\n💰 *Subtotal:* ${fmt(order.subtotal)}`;
    message += `\n🚚 *Frete:* ${fmt(order.shipping.price)}`;
    message += `\n💵 *Total:* ${fmt(order.total)}`;
    message += `\n💳 *Pagamento:* ${paymentLine}`;
    message += '\n\n👤 *Nome:* \n⏰ *Obs:* ';
    return message;
  }

  function openWhatsApp(order, method, popup = null) {
    const message = buildWhatsAppMessage(order, method);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    if (popup && !popup.closed) {
      popup.opener = null;
      popup.location.replace(url);
    } else {
      window.location.assign(url);
    }
    onClear();
    setPreparedOrder(null);
    setPixOpen(false);
    onClose();
  }

  function validateChange() {
    if (selectedPayment !== 'dinheiro' || needsChange !== true) return true;
    const amount = Number(changeFor);
    if (!Number.isFinite(amount) || amount < total) {
      showToast(`Informe um valor para troco de pelo menos ${fmt(total)}.`);
      return false;
    }
    return true;
  }

  async function handleCheckout() {
    if (sending) return;
    if (!cart.length) { showToast('Carrinho vazio'); return; }
    if (productsLoading || productsError) { showToast('Aguarde o cardápio carregar para finalizar.'); return; }
    if (storeLoading || storeError) { showToast('Aguarde a confirmação do atendimento para finalizar.'); return; }
    if (!storeOpen) { showToast(closedMessage || 'No momento não estamos fazendo delivery.'); return; }
    if (unavailableIds.length) {
      onRemoveItems(unavailableIds);
      showToast('Itens que saíram do cardápio foram removidos. Confira o pedido.');
      return;
    }
    if (!validateChange()) return;

    const popup = selectedPayment === 'dinheiro' ? window.open('', '_blank') : null;
    setSending(true);
    try {
      const validatedItems = await validateOrder(cart);
      const order = buildOrder(validatedItems, shipping);
      if (selectedPayment === 'pix') {
        setPreparedOrder(order);
        onClose();
        setPixOpen(true);
      } else {
        openWhatsApp(order, 'dinheiro', popup);
      }
    } catch (error) {
      if (popup && !popup.closed) popup.close();
      showToast(error?.message || 'Não foi possível validar o pedido. Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  function handlePixConfirmation() {
    if (!preparedOrder || sending) return;
    const popup = window.open('', '_blank');
    setSending(true);
    try {
      openWhatsApp(preparedOrder, 'pix', popup);
    } finally {
      setSending(false);
    }
  }

  function handleClear() {
    onClear();
    showToast('Carrinho limpo');
  }

  async function copyPix() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponível');
      await navigator.clipboard.writeText(PIX_KEY);
      showToast('Chave copiada!');
    } catch {
      showToast(`Não foi possível copiar. Chave Pix: ${PIX_KEY}`);
    }
  }

  function handleSelectPayment(method) {
    setSelectedPayment(method);
    if (method !== 'dinheiro') {
      setNeedsChange(null);
      setChangeFor('');
    }
  }

  const checkoutUnavailable = sending || storeLoading || Boolean(storeError) || productsLoading || Boolean(productsError);

  return (
    <>
      {isOpen && (
        <>
          <div className="drawer-overlay active" onClick={onClose} aria-hidden="true" />
          <aside
            ref={drawerRef}
            className="cart-drawer open"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="drawer-header">
              <h2 id="cart-title">Seu pedido</h2>
              <button ref={drawerCloseRef} type="button" className="drawer-close" onClick={onClose} aria-label="Fechar carrinho">
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>

            <div className="drawer-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <i className="fas fa-shopping-bag" aria-hidden="true" />
                  <p>Seu carrinho está vazio</p>
                  <span>Adicione itens do cardápio</span>
                </div>
              ) : cart.map((item) => (
                <div className={`cart-item${item.invalid ? ' cart-item--invalid' : ''}`} key={item.id}>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    {item.invalid
                      ? <p>Remova este item para continuar.</p>
                      : <p>{fmt(item.price)} <span className="cart-item-unit">× {item.qty}</span> = <strong>{fmt(item.price * item.qty)}</strong></p>}
                  </div>
                  <div className="cart-item-actions">
                    <button type="button" onClick={() => onDec(item.id)} aria-label={`Remover uma unidade de ${item.name}`}>−</button>
                    <span aria-label={`${item.qty} unidades`}>{item.qty}</span>
                    <button type="button" onClick={() => onInc(item.id)} disabled={item.invalid || item.qty >= MAX_ITEM_QUANTITY} aria-label={`Adicionar uma unidade de ${item.name}`}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-shipping">
              <div className="subtotal"><span>Subtotal</span><strong>{fmt(subtotal)}</strong></div>
              <div className="shipping-section">
                <h3><i className="fas fa-truck" aria-hidden="true" /> Entrega</h3>
                <ShippingSelect onShippingChange={setShipping} />
              </div>
            </div>

            <div className="drawer-footer">
              <div className="final-total"><span>Total</span><strong>{fmt(total)}</strong></div>

              {(storeLoading || storeError || !storeOpen) ? (
                <div className="store-closed-notice" role="status">
                  <i className={`fas ${storeLoading ? 'fa-spinner fa-spin' : 'fa-store-slash'}`} aria-hidden="true" />
                  <p>{storeLoading ? 'Verificando se a loja está aberta…' : closedMessage}</p>
                  {storeError && <button type="button" className="btn btn-outline" onClick={onRetryStore}>Tentar novamente</button>}
                  {!storeLoading && !storeError && <button type="button" className="btn btn-outline" onClick={handleClear}><i className="fas fa-trash" aria-hidden="true" /> Limpar Carrinho</button>}
                </div>
              ) : (
                <>
                  <div className="payment-section">
                    <h3><i className="fas fa-wallet" aria-hidden="true" /> Pagamento</h3>
                    <div className="payment-options">
                      {['dinheiro', 'pix'].map((method) => (
                        <button
                          type="button"
                          key={method}
                          data-method={method}
                          className={`payment-option${selectedPayment === method ? ' active' : ''}`}
                          onClick={() => handleSelectPayment(method)}
                          aria-pressed={selectedPayment === method}
                        >
                          {method === 'dinheiro'
                            ? <><i className="fas fa-money-bill-wave" aria-hidden="true" /><span>Dinheiro</span></>
                            : <><i className="fa-brands fa-pix pix-logo" aria-hidden="true" /><span>Pix</span></>}
                        </button>
                      ))}
                    </div>

                    {selectedPayment === 'dinheiro' && (
                      <div className="change-box">
                        <p className="change-question"><i className="fas fa-coins" aria-hidden="true" /> Precisa de troco?</p>
                        <div className="change-options">
                          <button type="button" aria-pressed={needsChange === false} className={`change-btn${needsChange === false ? ' change-btn--no' : ''}`} onClick={() => { setNeedsChange(false); setChangeFor(''); }}>Não preciso</button>
                          <button type="button" aria-pressed={needsChange === true} className={`change-btn${needsChange === true ? ' change-btn--yes' : ''}`} onClick={() => setNeedsChange(true)}>Sim, preciso</button>
                        </div>
                        {needsChange === true && (
                          <label className="change-input-wrap">
                            <span className="change-prefix">R$</span>
                            <span className="sr-only">Valor em dinheiro para calcular o troco</span>
                            <input
                              className="change-input"
                              type="number"
                              inputMode="decimal"
                              min={total.toFixed(2)}
                              step="0.01"
                              required
                              placeholder={`Troco para quanto? (mín. ${fmt(total)})`}
                              value={changeFor}
                              onChange={(event) => setChangeFor(event.target.value)}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="cart-actions">
                    <button type="button" className="btn btn-primary" onClick={handleCheckout} disabled={checkoutUnavailable}>
                      <i className="fab fa-whatsapp" aria-hidden="true" /> {sending ? 'Validando…' : 'Finalizar no WhatsApp'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={handleClear}><i className="fas fa-trash" aria-hidden="true" /> Limpar Carrinho</button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {pixOpen && preparedOrder && (
        <div className="pix-overlay active" onClick={(event) => { if (event.target === event.currentTarget) closePix(); }}>
          <div ref={pixRef} className="pix-modal" role="dialog" aria-modal="true" aria-labelledby="pix-title">
            <button ref={pixCloseRef} type="button" className="pix-close" onClick={closePix} aria-label="Fechar pagamento Pix"><i className="fas fa-times" aria-hidden="true" /></button>
            <div className="pix-header">
              <div className="pix-header-icon"><i className="fas fa-qrcode" aria-hidden="true" /></div>
              <div><h2 id="pix-title">Pagar com Pix</h2><p>Total: {fmt(preparedOrder.total)}</p></div>
            </div>
            <div className="pix-qr-wrapper">
              <img src={qrCode} alt="QR Code da chave Pix da Mikami Sushi" className="pix-qr-img" />
              <p className="pix-qr-hint">Aponte a câmera para pagar</p>
            </div>
            <div className="pix-divider"><span>ou copie a chave</span></div>
            <div className="pix-key-wrapper">
              <span className="pix-key-value">{PIX_KEY}</span>
              <button type="button" className="pix-copy-btn" onClick={copyPix}><i className="fas fa-copy" aria-hidden="true" /> Copiar</button>
            </div>
            <button type="button" className="btn btn-primary pix-confirm-btn" onClick={handlePixConfirmation} disabled={sending}>
              <i className="fab fa-whatsapp" aria-hidden="true" /> {sending ? 'Abrindo…' : 'Já paguei — Enviar pedido'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .store-closed-notice { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 18px 14px; background: var(--bg-3); border: 1px solid var(--red-border); border-radius: var(--r-md); }
        .store-closed-notice i { font-size: 1.4rem; color: var(--red); }
        .store-closed-notice p { font-size: 0.85rem; font-weight: 600; color: var(--text-1); line-height: 1.5; margin: 0; }
        .change-box { margin-top: 12px; background: var(--bg-3); border: 1px solid var(--border); border-radius: var(--r-md); padding: 13px 14px; display: flex; flex-direction: column; gap: 10px; }
        .change-question { font-size: 0.78rem; font-weight: 600; color: var(--text-2); display: flex; align-items: center; gap: 7px; margin: 0; }
        .change-question i { color: var(--gold); font-size: 0.82rem; }
        .change-options { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .change-btn { padding: 8px; border-radius: var(--r-sm); border: 1px solid var(--border); background: var(--bg-4); color: var(--text-3); font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s var(--ease); }
        .change-btn:hover { border-color: var(--border-2); color: var(--text-1); }
        .change-btn--no { border-color: #4ade80; background: rgba(74, 222, 128, 0.08); color: #4ade80; }
        .change-btn--yes { border-color: var(--gold); background: var(--gold-soft); color: var(--gold-text); }
        .change-input-wrap { display: flex; align-items: center; gap: 8px; background: var(--bg-2); border: 1px solid var(--border-2); border-radius: var(--r-sm); padding: 9px 12px; transition: border-color 0.2s var(--ease); }
        .change-input-wrap:focus-within { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-soft); }
        .change-prefix { font-size: 0.82rem; font-weight: 700; color: var(--gold-text); flex-shrink: 0; }
        .change-input { flex: 1; background: transparent; border: none; outline: none; font-family: var(--font-body); font-size: 0.88rem; font-weight: 600; color: var(--text-1); width: 100%; }
        .change-input::placeholder { color: var(--text-4); font-weight: 400; font-size: 0.78rem; }
        .change-input::-webkit-outer-spin-button, .change-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .change-input[type=number] { -moz-appearance: textfield; }
        .cart-item--invalid { border-color: var(--red-border); }
      `}</style>
    </>
  );
}
