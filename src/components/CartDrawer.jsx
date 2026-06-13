import { useState } from 'react';
import { fmt } from '../hooks/useCart';
import { WHATSAPP_NUMBER, PIX_KEY } from '../data/menuItems';
import ShippingSelect from './ShippingSelect';

export default function CartDrawer({ isOpen, onClose, cart, subtotal, onInc, onDec, onClear, showToast }) {
  const [shipping, setShipping] = useState({ price: 0, label: 'Retirada' });
  const [selectedPayment, setSelectedPayment] = useState('dinheiro');
  const [pixOpen, setPixOpen] = useState(false);

  const total = subtotal + shipping.price;

  function buildWhatsAppMessage(method) {
    const paymentLine = method === 'pix'
      ? `Pix — Chave: ${PIX_KEY}`
      : 'Dinheiro em espécie';

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

  function sendToWhatsApp(method) {
    const msg = buildWhatsAppMessage(method);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  }

  function handleCheckout() {
    if (cart.length === 0) { showToast('Carrinho vazio'); return; }
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

  return (
    <>
      {/* Overlay */}
      <div className={`drawer-overlay${isOpen ? ' active' : ''}`} onClick={onClose}></div>

      {/* Drawer */}
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

          <div className="payment-section">
            <h3><i className="fas fa-wallet"></i> Pagamento</h3>
            <div className="payment-options">
              {['dinheiro', 'pix'].map(method => (
                <button
                  key={method}
                  className={`payment-option${selectedPayment === method ? ' active' : ''}`}
                  onClick={() => setSelectedPayment(method)}
                  aria-pressed={selectedPayment === method}
                >
                  {method === 'dinheiro'
                    ? <><i className="fas fa-money-bill-wave"></i><span>Dinheiro</span></>
                    : <><i className="fa-brands fa-pix pix-logo"></i><span>Pix</span></>
                  }
                </button>
              ))}
            </div>
          </div>

          <div className="cart-actions">
            <button className="btn btn-primary" onClick={handleCheckout}>
              <i className="fab fa-whatsapp"></i> Finalizar no WhatsApp
            </button>
            <button className="btn btn-outline" onClick={handleClear}>
              <i className="fas fa-trash"></i> Limpar Carrinho
            </button>
          </div>
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
            <button className="btn btn-primary pix-confirm-btn" onClick={() => { setPixOpen(false); sendToWhatsApp('pix'); }}>
              <i className="fab fa-whatsapp"></i> Já paguei — Enviar pedido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
