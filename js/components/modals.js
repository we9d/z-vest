/**
 * FINVEST Modal Components Controller
 * Manages order confirmation sheets, virtual trade modals, simulation modals, and toast alerts.
 */

/**
 * Open Order Confirmation Modal
 * @param {'BUY' | 'SELL'} type
 */
function openOrderModal(type = 'BUY') {
  window.appState.orderType = type;
  const modal = document.getElementById('modal-order');
  const title = document.getElementById('order-type-title');
  const notice = document.getElementById('order-mode-notice');
  const confirmBtn = document.getElementById('order-confirm-btn');

  const asset = window.appState.selectedAsset || {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    price: '฿19,550.00',
    priceNum: 19550
  };

  const symbolEl = document.getElementById('order-symbol');
  const priceUnitEl = document.getElementById('order-price-unit');
  const qtyInput = document.getElementById('order-qty-input');

  if (symbolEl) symbolEl.textContent = `${asset.symbol} (${asset.name})`;
  if (priceUnitEl) priceUnitEl.textContent = asset.price;
  if (qtyInput) qtyInput.value = 1;

  recalcOrderTotal();

  if (type === 'BUY') {
    if (title) title.textContent = window.appState.mode === 'real' ? 'ยืนยันคำสั่งซื้อจริง (Buy Real)' : 'ยืนยันคำสั่งซื้อจำลอง (Buy Sim)';
    if (confirmBtn) confirmBtn.textContent = window.appState.mode === 'real' ? 'ยืนยันส่งคำสั่งซื้อจริง' : 'ยืนยันส่งคำสั่งซื้อจำลอง';
  } else {
    if (title) title.textContent = window.appState.mode === 'real' ? 'ยืนยันคำสั่งขายจริง (Sell Real)' : 'ยืนยันคำสั่งขายจำลอง (Sell Sim)';
    if (confirmBtn) confirmBtn.textContent = window.appState.mode === 'real' ? 'ยืนยันส่งคำสั่งขายจริง' : 'ยืนยันส่งคำสั่งขายจำลอง';
  }

  if (window.appState.mode === 'real') {
    if (notice) {
      notice.className = 'p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-brand-blue font-bold flex items-center space-x-2';
      notice.innerHTML = '<span>🔵 กำลังทำรายการใน: โหมดลงทุนจริง (Real Money)</span>';
    }
    if (confirmBtn) {
      confirmBtn.className = 'tap-active w-full py-3.5 rounded-2xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm shadow-md transition';
    }
  } else {
    if (notice) {
      notice.className = 'p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-brand-teal font-bold flex items-center space-x-2';
      notice.innerHTML = '<span>🟢 กำลังทำรายการใน: โหมดจำลองลงทุน (Virtual Money)</span>';
    }
    if (confirmBtn) {
      confirmBtn.className = 'tap-active w-full py-3.5 rounded-2xl bg-brand-teal hover:bg-teal-500 text-white font-bold text-sm shadow-md transition';
    }
  }

  if (modal) modal.classList.remove('hidden');
}

function closeOrderModal() {
  const modal = document.getElementById('modal-order');
  if (modal) modal.classList.add('hidden');
}

function adjustOrderQty(delta) {
  const input = document.getElementById('order-qty-input');
  if (!input) return;
  const current = parseInt(input.value, 10) || 1;
  input.value = Math.max(1, current + delta);
  recalcOrderTotal();
}

function recalcOrderTotal() {
  const qtyInput = document.getElementById('order-qty-input');
  const totalEl = document.getElementById('order-total');
  const asset = window.appState.selectedAsset || { priceNum: 19550 };
  const qty = parseFloat(qtyInput ? qtyInput.value : 1) || 0;
  const total = qty * asset.priceNum;

  if (totalEl) {
    totalEl.textContent = '฿' + total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

function confirmOrderSuccess() {
  closeOrderModal();
  const modal = document.getElementById('modal-success');
  const desc = document.getElementById('success-desc');

  if (desc) {
    if (window.appState.mode === 'real') {
      desc.textContent = 'ส่งคำสั่งซื้อ/ขายในโหมดพอร์ตจริงเรียบร้อยแล้ว';
    } else {
      desc.textContent = 'ส่งคำสั่งในโหมดจำลองเรียบร้อยแล้ว (ไม่กระทบเงินจริง)';
    }
  }

  if (modal) modal.classList.remove('hidden');
}

function closeSuccessModal() {
  const modal = document.getElementById('modal-success');
  if (modal) modal.classList.add('hidden');

  if (window.appState.mode === 'real') {
    navTo('screen-real-portfolio');
  } else {
    navTo('screen-sim-summary');
  }
}

/**
 * Watchlist Toast Notification
 */
function showWatchlistToast(msg, isAdded) {
  const toast = document.getElementById('watchlist-toast');
  const toastText = document.getElementById('watchlist-toast-text');
  const toastIcon = document.getElementById('watchlist-toast-icon');
  if (!toast || !toastText) return;

  toastText.textContent = msg;
  if (toastIcon) {
    toastIcon.className = isAdded ? 'text-amber-800' : 'text-slate-400';
  }

  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');

  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 1800);
}

/**
 * Simulator Sections (Trading Modal, Scenario Modal, AI Modal)
 */
function openSimSection(sec) {
  if (sec === 'trading') {
    if (typeof openUnifiedTradingScreen === 'function') {
      openUnifiedTradingScreen('sim', null, 'NVDA');
    } else {
      const modal = document.getElementById('modal-sim-trading');
      if (modal) modal.classList.remove('hidden');
    }
  } else if (sec === 'scenario') {
    const m = document.getElementById('modal-sim-scenario');
    if (m) m.classList.remove('hidden');
  } else if (sec === 'ai') {
    const m = document.getElementById('modal-sim-ai');
    if (m) m.classList.remove('hidden');
  }
  updateNavVisibility();
}

function closeSimSection(sec) {
  if (sec === 'trading') {
    const m = document.getElementById('modal-sim-trading');
    if (m) m.classList.add('hidden');
  } else if (sec === 'scenario') {
    const m = document.getElementById('modal-sim-scenario');
    if (m) m.classList.add('hidden');
  } else if (sec === 'ai') {
    const m = document.getElementById('modal-sim-ai');
    if (m) m.classList.add('hidden');
  }
  updateNavVisibility();
}

// Global Exports
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.adjustOrderQty = adjustOrderQty;
window.recalcOrderTotal = recalcOrderTotal;
window.confirmOrderSuccess = confirmOrderSuccess;
window.closeSuccessModal = closeSuccessModal;
window.showWatchlistToast = showWatchlistToast;
window.openSimSection = openSimSection;
window.closeSimSection = closeSimSection;

