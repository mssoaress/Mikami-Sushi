document.addEventListener('DOMContentLoaded', function () {

  // =========================================
  //  ELEMENTOS
  // =========================================
  const cartHeader     = document.getElementById('cartHeader');
  const cartFloating   = document.getElementById('cartFloating');
  const cartDrawer     = document.getElementById('cartDrawer');
  const drawerOverlay  = document.getElementById('cartOverlay');
  const closeCart      = document.getElementById('closeCart');
  const cartItemsEl    = document.getElementById('cartItems');
  const cartSubtotal   = document.getElementById('cartSubtotal');
  const cartTotal      = document.getElementById('cartTotal');
  const clearCartBtn   = document.getElementById('clearCart');
  const checkoutBtn    = document.getElementById('checkoutWhats');
  const cartBadges     = document.querySelectorAll('.cart-badge');
  const toastContainer = document.getElementById('toast');
  const tabBtns        = document.querySelectorAll('.tab-btn');
  const menuGrids      = document.querySelectorAll('.menu-grid');

  // =========================================
  //  CONSTANTES
  // =========================================
  const WHATSAPP_NUMBER = '558197781945';
  const PIX_KEY         = '81997781945';

  // =========================================
  //  ESTADO
  // =========================================
  let cart            = JSON.parse(localStorage.getItem('mikamiCart')) || [];
  let shippingPrice   = 0;
  let shippingLabel   = 'Retirada';
  let selectedPayment = 'dinheiro';

  // =========================================
  //  UTILITÁRIOS
  // =========================================
  function saveCart() {
    localStorage.setItem('mikamiCart', JSON.stringify(cart));
  }

  function fmt(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function getTotal() {
    return getSubtotal() + shippingPrice;
  }

  function getCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  // =========================================
  //  BADGES
  // =========================================
  function updateBadges(animate = false) {
    const count = getCount();
    cartBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.opacity = count === 0 ? '0.4' : '1';
      if (animate) {
        badge.classList.remove('pulse');
        void badge.offsetWidth; // reflow para reiniciar animação
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 350);
      }
    });
  }

  // =========================================
  //  TOAST
  // =========================================
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.25s ease forwards';
      setTimeout(() => toast.remove(), 250);
    }, 1800);
  }

  // =========================================
  //  TOTAIS
  // =========================================
  function updateTotals() {
    if (cartSubtotal) cartSubtotal.textContent = fmt(getSubtotal());
    if (cartTotal)    cartTotal.textContent    = fmt(getTotal());
    updateBadges();
  }

  // =========================================
  //  RENDER CARRINHO
  // =========================================
  function renderCart() {
    if (!cartItemsEl) return;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-bag"></i>
          <p>Seu carrinho está vazio</p>
          <span>Adicione itens do cardápio</span>
        </div>`;
      updateTotals();
      return;
    }

    cartItemsEl.innerHTML = cart.map((item, index) => `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${fmt(item.price)} <span class="cart-item-unit">× ${item.qty}</span> = <strong>${fmt(item.price * item.qty)}</strong></p>
        </div>
        <div class="cart-item-actions">
          <button class="dec-item" data-index="${index}" aria-label="Remover um">−</button>
          <span>${item.qty}</span>
          <button class="inc-item" data-index="${index}" aria-label="Adicionar um">+</button>
        </div>
      </div>
    `).join('');

    updateTotals();
  }

  // =========================================
  //  AÇÕES DO CARRINHO
  // =========================================
  function addToCart(id, name, price, triggerEl) {
    const existing = cart.find(item => item.id == id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price: parseFloat(price), qty: 1 });
    }
    saveCart();
    renderCart();
    updateBadges(true);
    showToast(`${name} adicionado`);

    // micro-animação no card
    const card = triggerEl?.closest('.menu-item');
    if (card) {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => (card.style.transform = ''), 160);
    }
  }

  function incItem(index) {
    if (!cart[index]) return;
    cart[index].qty += 1;
    saveCart(); renderCart(); updateBadges(true);
  }

  function decItem(index) {
    if (!cart[index]) return;
    cart[index].qty -= 1;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(); renderCart(); updateBadges(true);
  }

  // =========================================
  //  FRETE
  // =========================================
  function updateShipping() {
    const selected = document.querySelector('.custom-select__option.selected');
    if (selected) {
      shippingPrice = parseFloat(selected.dataset.price) || 0;
      shippingLabel = selected.dataset.label || 'Retirada';
      updateTotals();
    }
  }

  // =========================================
  //  DRAWER
  // =========================================
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
  if (closeCart)    closeCart.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // =========================================
  //  EVENTOS DELEGADOS (menu + carrinho)
  // =========================================
  document.addEventListener('click', function (e) {
    // Botão "+" no cardápio
    const addBtn = e.target.closest('.btn-add');
    if (addBtn) {
      e.preventDefault();
      const { id, name, price } = addBtn.dataset;
      if (id && name && !isNaN(parseFloat(price))) {
        addToCart(id, name, price, addBtn);
      }
      return;
    }

    // Incrementar no carrinho
    const incBtn = e.target.closest('.inc-item');
    if (incBtn) { incItem(parseInt(incBtn.dataset.index)); return; }

    // Decrementar no carrinho
    const decBtn = e.target.closest('.dec-item');
    if (decBtn) { decItem(parseInt(decBtn.dataset.index)); return; }
  });

  // =========================================
  //  CUSTOM SELECT DE ENTREGA
  // =========================================
  const customShipping   = document.getElementById('customShipping');
  const shippingTrigger  = document.getElementById('shippingTrigger');
  const shippingDropdown = document.getElementById('shippingDropdown');

  function positionDropdown() {
    if (!shippingTrigger || !shippingDropdown) return;
    const rect = shippingTrigger.getBoundingClientRect();
    shippingDropdown.style.bottom = (window.innerHeight - rect.top + 6) + 'px';
    shippingDropdown.style.top    = 'auto';
    shippingDropdown.style.left   = rect.left + 'px';
    shippingDropdown.style.width  = rect.width + 'px';
  }

  if (shippingTrigger) {
    shippingTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = customShipping.classList.toggle('open');
      if (isOpen) positionDropdown();
    });
  }

  if (shippingDropdown) {
    shippingDropdown.addEventListener('click', function (e) {
      const option = e.target.closest('.custom-select__option');
      if (!option) return;

      shippingDropdown.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      document.getElementById('shippingLabel').textContent      = option.dataset.label;
      document.getElementById('shippingPriceLabel').textContent  = option.dataset.display;

      const priceEl = document.getElementById('shippingPriceLabel');
      priceEl.className = 'custom-select__price' + (option.dataset.free ? ' free' : '');
      document.querySelector('.custom-select__icon').textContent = option.dataset.icon;

      customShipping.classList.remove('open');
      updateShipping();
    });
  }

  // Fechar dropdown ao clicar fora
  document.addEventListener('click', function (e) {
    if (customShipping && !customShipping.contains(e.target)) {
      customShipping.classList.remove('open');
    }
  });

  // =========================================
  //  PAGAMENTO
  // =========================================
  document.querySelectorAll('.payment-option').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.payment-option').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedPayment = this.dataset.method;
    });
  });

  // =========================================
  //  LIMPAR CARRINHO
  // =========================================
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function () {
      cart = [];
      shippingPrice = 0;
      shippingLabel = 'Retirada';

      // Reset dropdown para Retirada
      if (shippingDropdown) {
        shippingDropdown.querySelectorAll('.custom-select__option').forEach((o, i) => {
          o.classList.toggle('selected', i === 0);
        });
        const lbl = document.getElementById('shippingLabel');
        const prc = document.getElementById('shippingPriceLabel');
        const ico = document.querySelector('.custom-select__icon');
        if (lbl) lbl.textContent = 'Retirada';
        if (prc) { prc.textContent = 'Grátis'; prc.className = 'custom-select__price free'; }
        if (ico) ico.textContent = '🏠';
      }

      saveCart(); renderCart(); updateBadges(true);
      showToast('Carrinho limpo');
    });
  }

  // =========================================
  //  MONTAR MENSAGEM WHATSAPP  (função única)
  // =========================================
  function buildWhatsAppMessage(method) {
    const paymentLine = method === 'pix'
      ? `Pix — Chave: ${PIX_KEY}`
      : 'Dinheiro em espécie';

    let msg = '🍣 *NOVO PEDIDO — MIKAMI SUSHI* 🍣\n\n';
    msg += '*ITENS:*\n';
    cart.forEach(item => {
      msg += `• ${item.name} (${item.qty}x) — ${fmt(item.price * item.qty)}\n`;
    });
    msg += `\n📦 *Entrega:* ${shippingLabel}`;
    msg += `\n💰 *Subtotal:* ${fmt(getSubtotal())}`;
    msg += `\n🚚 *Frete:* ${fmt(shippingPrice)}`;
    msg += `\n💵 *Total:* ${fmt(getTotal())}`;
    msg += `\n💳 *Pagamento:* ${paymentLine}`;
    msg += '\n\n👤 *Nome:* ';
    msg += '\n⏰ *Obs:* ';

    return msg;
  }

  function sendToWhatsApp(method) {
    const msg = buildWhatsAppMessage(method);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    closeDrawer();
  }

  // =========================================
  //  MODAL PIX
  // =========================================
  const pixOverlay    = document.getElementById('pixOverlay');
  const pixClose      = document.getElementById('pixClose');
  const pixCopyBtn    = document.getElementById('pixCopyBtn');
  const pixConfirmBtn = document.getElementById('pixConfirmBtn');
  const pixOrderTotal = document.getElementById('pixOrderTotal');

  function openPixModal() {
    if (pixOrderTotal) pixOrderTotal.textContent = `Total: ${fmt(getTotal())}`;
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

  // Checkout — decide entre modal Pix ou direto WhatsApp
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      if (cart.length === 0) { showToast('Carrinho vazio'); return; }
      if (selectedPayment === 'pix') {
        closeDrawer();
        openPixModal();
      } else {
        sendToWhatsApp('dinheiro');
      }
    });
  }

  if (pixClose)   pixClose.addEventListener('click', closePixModal);
  if (pixOverlay) pixOverlay.addEventListener('click', e => { if (e.target === pixOverlay) closePixModal(); });

  // Copiar chave Pix
  if (pixCopyBtn) {
    pixCopyBtn.addEventListener('click', function () {
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

  // Confirmar Pix → WhatsApp
  if (pixConfirmBtn) {
    pixConfirmBtn.addEventListener('click', function () {
      closePixModal();
      sendToWhatsApp('pix');
    });
  }

  // =========================================
  //  ABAS DO CARDÁPIO
  // =========================================
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const tab = this.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      menuGrids.forEach(grid => {
        grid.classList.remove('active');
        if (grid.id === `${tab}-items`) grid.classList.add('active');
      });
    });
  });

  // =========================================
  //  INIT
  // =========================================
  renderCart();
  updateShipping();
});