document.addEventListener('DOMContentLoaded', function() {
  // Elementos
  const cartHeader    = document.getElementById('cartHeader');
  const cartFloating  = document.getElementById('cartFloating');
  const cartDrawer    = document.getElementById('cartDrawer');
  const drawerOverlay = document.getElementById('cartOverlay');
  const closeCart     = document.getElementById('closeCart');
  const cartItems     = document.getElementById('cartItems');
  const cartSubtotal  = document.getElementById('cartSubtotal');
  const shippingCost  = document.getElementById('shippingCost'); // optional element
  const cartTotal     = document.getElementById('cartTotal');
  const clearCartBtn  = document.getElementById('clearCart');
  const checkoutBtn   = document.getElementById('checkoutWhats');
  const cartBadges    = document.querySelectorAll('.cart-badge');
  const toastContainer= document.getElementById('toast');

  // Abas
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const menuGrids = document.querySelectorAll('.menu-grid');

  // WhatsApp
  const WHATSAPP_NUMBER = '558197781945';
  const PIX_KEY        = '81997781945';

  // Estado
  let cart           = JSON.parse(localStorage.getItem('mikamiCart')) || [];
  let shippingPrice  = 0;
  let selectedPayment = 'dinheiro';

  // ===== AUXILIARES =====
  function saveCart() {
    localStorage.setItem('mikamiCart', JSON.stringify(cart));
  }

  function formatCurrency(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
  }

  function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function getCartTotal() {
    return getCartSubtotal() + shippingPrice;
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function updateBadges(animate = false) {
    const count = getCartCount();
    cartBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.opacity = count === 0 ? '0.4' : '1';
    });
    if (animate) {
      cartBadges.forEach(badge => {
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 300);
      });
    }
  }

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function updateTotals() {
    if (cartSubtotal) cartSubtotal.textContent = formatCurrency(getCartSubtotal());
    if (shippingCost)  shippingCost.textContent  = formatCurrency(shippingPrice); // if element exists
    if (cartTotal)     cartTotal.textContent      = formatCurrency(getCartTotal());
    updateBadges();
  }

  function renderCart() {
    if (!cartItems) return;
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Carrinho vazio.</p>';
      updateTotals();
      return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${formatCurrency(item.price)} × ${item.qty} = ${formatCurrency(item.price * item.qty)}</p>
        </div>
        <div class="cart-item-actions">
          <button class="dec-item" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button class="inc-item" data-index="${index}">+</button>
        </div>
      </div>
    `).join('');

    updateTotals();
  }

  function addToCart(id, name, price, element) {
    const existing = cart.find(item => item.id == id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    saveCart();
    renderCart();
    updateBadges(true);
    showToast(`${name} adicionado`);

    const card = element?.closest('.menu-item');
    if (card) {
      card.style.transform = 'scale(0.98)';
      setTimeout(() => card.style.transform = '', 150);
    }
  }

  function incItem(index) {
    if (cart[index]) {
      cart[index].qty += 1;
      saveCart(); renderCart(); updateBadges(true);
    }
  }

  function decItem(index) {
    if (cart[index]) {
      cart[index].qty -= 1;
      if (cart[index].qty <= 0) cart.splice(index, 1);
      saveCart(); renderCart(); updateBadges(true);
    }
  }

  function updateShipping() {
    const selected = document.querySelector('.custom-select__option.selected');
    if (selected) {
      shippingPrice = parseFloat(selected.dataset.price) || 0;
      updateTotals();
    }
  }

  // ===== DRAWER =====
  function openDrawer() {
    cartDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateShipping();
  }

  function closeDrawer() {
    cartDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  [cartHeader, cartFloating].forEach(btn => {
    if (btn) btn.addEventListener('click', openDrawer);
  });
  if (closeCart)     closeCart.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // ===== EVENTOS DELEGADOS =====
  document.addEventListener('click', function(e) {
    const addBtn = e.target.closest('.btn-add');
    if (addBtn) {
      e.preventDefault();
      const { id, name, price } = addBtn.dataset;
      if (id && name && !isNaN(parseFloat(price))) {
        addToCart(id, name, parseFloat(price), addBtn);
      }
      return;
    }

    const incBtn = e.target.closest('.inc-item');
    if (incBtn) { incItem(parseInt(incBtn.dataset.index)); return; }

    const decBtn = e.target.closest('.dec-item');
    if (decBtn) { decItem(parseInt(decBtn.dataset.index)); return; }

    // (frete agora é select, tratado no listener acima)
  });

  // Custom dropdown de entrega
  const customShipping  = document.getElementById('customShipping');
  const shippingTrigger = document.getElementById('shippingTrigger');
  const shippingDropdown= document.getElementById('shippingDropdown');

  function positionDropdown() {
    if (!shippingTrigger || !shippingDropdown) return;
    const rect = shippingTrigger.getBoundingClientRect();
    const dropH = shippingDropdown.offsetHeight || 300;
    // Abre sempre para CIMA do trigger
    shippingDropdown.style.bottom = (window.innerHeight - rect.top + 6) + 'px';
    shippingDropdown.style.top    = 'auto';
    shippingDropdown.style.left   = rect.left + 'px';
    shippingDropdown.style.width  = rect.width + 'px';
  }

  if (shippingTrigger) {
    shippingTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = customShipping.classList.toggle('open');
      if (isOpen) positionDropdown();
    });
  }

  if (shippingDropdown) {
    shippingDropdown.addEventListener('click', function(e) {
      const option = e.target.closest('.custom-select__option');
      if (!option) return;

      // Remove selected de todos
      shippingDropdown.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      // Atualiza trigger
      document.getElementById('shippingLabel').textContent = option.dataset.label;
      document.getElementById('shippingPriceLabel').textContent = option.dataset.display;
      const priceEl = document.getElementById('shippingPriceLabel');
      priceEl.className = 'custom-select__price' + (option.dataset.free ? ' free' : '');
      document.querySelector('.custom-select__icon').textContent = option.dataset.icon;

      customShipping.classList.remove('open');
      updateShipping();
    });
  }

  // Fechar ao clicar fora
  document.addEventListener('click', function(e) {
    if (customShipping && !customShipping.contains(e.target)) {
      customShipping.classList.remove('open');
    }
  });

  // ===== SELETOR DE PAGAMENTO =====
  document.querySelectorAll('.payment-option').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.payment-option').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedPayment = this.dataset.method;
    });
  });

  // ===== LIMPAR =====
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
      cart = [];
      shippingPrice = 0;
      // Reset dropdown para Retirada
      if (shippingDropdown) {
        shippingDropdown.querySelectorAll('.custom-select__option').forEach((o, i) => {
          o.classList.toggle('selected', i === 0);
        });
        document.getElementById('shippingLabel').textContent = 'Retirada';
        document.getElementById('shippingPriceLabel').textContent = 'Grátis';
        document.getElementById('shippingPriceLabel').className = 'custom-select__price free';
        document.querySelector('.custom-select__icon').textContent = '🏠';
      }
      saveCart(); renderCart(); updateBadges(true);
      showToast('Carrinho limpo');
    });
  }

  // ===== WHATSAPP — DINHEIRO (direto) =====
  function sendToWhatsAppCash() {
    const selectedOpt  = document.querySelector('.custom-select__option.selected');
    const shippingName = selectedOpt ? selectedOpt.dataset.label : 'Retirada';
    const subtotal     = getCartSubtotal();
    const total        = getCartTotal();

    let msg = '\u{1F363} *NOVO PEDIDO - MIKAMI SUSHI* \u{1F363}\n\n';
    msg += '*ITENS:*\n';
    cart.forEach(item => {
      msg += `- ${item.name} (${item.qty}x) — ${formatCurrency(item.price * item.qty)}\n`;
    });
    msg += `\n\u{1F4E6} *Entrega:* ${shippingName}`;
    msg += `\n\u{1F4B0} *Subtotal:* ${formatCurrency(subtotal)}`;
    msg += `\n\u{1F69A} *Frete:* ${formatCurrency(shippingPrice)}`;
    msg += `\n\u{1F4B5} *Total:* ${formatCurrency(total)}`;
    msg += `\n\u{1F4B8} *Pagamento:* Dinheiro em espécie`;
    msg += '\n\n\u{1F464} *Nome:* ';
    msg += '\n\u23F0 *Obs:* ';

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    closeDrawer();
  }

  // ===== FUNÇÃO ENVIAR WHATSAPP =====
  function sendToWhatsApp() {
    const selectedOpt  = document.querySelector('.custom-select__option.selected');
    const shippingName = selectedOpt ? selectedOpt.dataset.label : 'Retirada';
    const subtotal     = getCartSubtotal();
    const total        = getCartTotal();

    let msg = '\u{1F363} *NOVO PEDIDO - MIKAMI SUSHI* \u{1F363}\n\n';
    msg += '*ITENS:*\n';
    cart.forEach(item => {
      msg += `- ${item.name} (${item.qty}x) — ${formatCurrency(item.price * item.qty)}\n`;
    });
    msg += `\n\u{1F4E6} *Entrega:* ${shippingName}`;
    msg += `\n\u{1F4B0} *Subtotal:* ${formatCurrency(subtotal)}`;
    msg += `\n\u{1F69A} *Frete:* ${formatCurrency(shippingPrice)}`;
    msg += `\n\u{1F4B5} *Total:* ${formatCurrency(total)}`;
    msg += `\n\u{1F4B8} *Pagamento:* Pix — Chave: ${PIX_KEY}`;
    msg += '\n\n\u{1F464} *Nome:* ';
    msg += '\n\u23F0 *Obs:* ';

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    closeDrawer();
  }

  // ===== MODAL PIX =====
  const pixOverlay    = document.getElementById('pixOverlay');
  const pixClose      = document.getElementById('pixClose');
  const pixCopyBtn    = document.getElementById('pixCopyBtn');
  const pixConfirmBtn = document.getElementById('pixConfirmBtn');
  const pixOrderTotal = document.getElementById('pixOrderTotal');
  const pixQrCode     = document.getElementById('pixQrCode');
  function openPixModal() {
    const total = getCartTotal();

    // Atualiza total no modal
    if (pixOrderTotal) pixOrderTotal.textContent = `Total: ${formatCurrency(total)}`;

    if (pixOverlay) {
      pixOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closePixModal() {
    if (pixOverlay) {
      pixOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Abrir modal ou ir direto ao WhatsApp dependendo do pagamento
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) { showToast('Carrinho vazio'); return; }
      if (selectedPayment === 'pix') {
        openPixModal();
      } else {
        sendToWhatsAppCash();
      }
    });
  }

  // Fechar modal
  if (pixClose)   pixClose.addEventListener('click', closePixModal);
  if (pixOverlay) pixOverlay.addEventListener('click', function(e) {
    if (e.target === pixOverlay) closePixModal();
  });

  // Copiar chave
  if (pixCopyBtn) {
    pixCopyBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(PIX_KEY).then(() => {
        pixCopyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        pixCopyBtn.classList.add('copied');
        setTimeout(() => {
          pixCopyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
          pixCopyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  // Confirmar pagamento e enviar WhatsApp
  if (pixConfirmBtn) {
    pixConfirmBtn.addEventListener('click', function() {
      closePixModal();
      sendToWhatsApp();
    });
  }

  // ===== ABAS =====
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      menuGrids.forEach(grid => {
        grid.classList.remove('active');
        if (grid.id === `${tab}-items`) grid.classList.add('active');
      });
    });
  });

  // ===== ANO =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== INIT =====
  renderCart();
  updateShipping();
});
