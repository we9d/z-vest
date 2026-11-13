/**
 * FINVEST Simulator Screen Controller
 * Handles simulator initial capital setup, virtual trading, and paper portfolio execution.
 */

function setSimInput(amt) {
  const input = document.getElementById('sim-custom-amount');
  if (input) input.value = amt;
}

function startSimulation() {
  const input = document.getElementById('sim-custom-amount');
  const amt = parseFloat(input ? input.value : 50000) || 50000;

  window.appState.simStartingCash = amt;
  window.appState.simRemainingCash = amt * 0.28;

  const startEl = document.getElementById('sim-summary-start');
  const valEl = document.getElementById('sim-summary-val');
  const cashEl = document.getElementById('sim-summary-cash');
  const pnlEl = document.getElementById('sim-summary-pnl');

  if (startEl) startEl.textContent = '฿' + amt.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (cashEl) cashEl.textContent = '฿' + (amt * 0.28).toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (valEl) valEl.textContent = '฿' + (amt * 1.0864).toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (pnlEl) pnlEl.textContent = '▲ +฿' + (amt * 0.0864).toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' (+8.64%)';

  navTo('screen-sim-summary');
}

function selectSimAsset(sym, name, price, change, cat, tag, code, range, pe, vol) {
  window.simTradeState.activeAsset = { sym, name, price, change, cat, tag, code, range, pe, vol };

  const card = document.getElementById('sim-asset-detail-card');
  if (card) card.classList.remove('hidden');

  const nameEl = document.getElementById('sim-card-name');
  const logoEl = document.getElementById('sim-card-logo');
  const tagEl = document.getElementById('sim-card-tag');
  const symEl = document.getElementById('sim-card-sym');
  const priceEl = document.getElementById('sim-card-price');
  const changeEl = document.getElementById('sim-card-change');
  const rEl = document.getElementById('sim-card-52w');
  const peEl = document.getElementById('sim-card-pe');
  const volEl = document.getElementById('sim-card-vol');

  if (nameEl) nameEl.textContent = name;
  if (logoEl) logoEl.textContent = sym.slice(0, 5);
  if (tagEl) tagEl.textContent = tag;
  if (symEl) symEl.textContent = code;
  if (priceEl) priceEl.textContent = '฿' + price.toLocaleString('en-US', { minimumFractionDigits: 2 });

  if (changeEl) {
    changeEl.textContent = (change.includes('+') ? '▲ ' : '▼ ') + change;
    changeEl.className = change.includes('+')
      ? 'text-xs font-bold text-brand-green font-num'
      : 'text-xs font-bold text-brand-red font-num';
  }

  if (rEl) rEl.textContent = range;
  if (peEl) peEl.textContent = pe;
  if (volEl) volEl.textContent = vol;
}

function hideSimAssetDetail() {
  const card = document.getElementById('sim-asset-detail-card');
  if (card) card.classList.add('hidden');
}

function setSimFilterTab(cat, btn) {
  document.querySelectorAll('.sim-tab-pill').forEach(b => {
    b.className = 'sim-tab-pill px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium shrink-0';
  });

  if (btn) btn.className = 'sim-tab-pill px-3 py-1 rounded-full bg-brand-navy text-white font-bold shrink-0';

  document.querySelectorAll('.sim-asset-card').forEach(item => {
    if (cat === 'all' || item.getAttribute('data-category') === cat) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function filterSimItems(query) {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('.sim-asset-card').forEach(item => {
    const sym = (item.getAttribute('data-symbol') || '').toLowerCase();
    const text = item.innerText.toLowerCase();
    if (sym.includes(q) || text.includes(q)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function openSimTradingOrderSheet(type) {
  window.simTradeState.tradeType = type;
  const sheet = document.getElementById('sim-order-sheet');
  if (sheet) sheet.classList.remove('hidden');

  const title = document.getElementById('sim-order-sheet-title');
  if (title) title.textContent = type === 'BUY' ? 'ยืนยันคำสั่งซื้อจำลอง (Buy Sim)' : 'ยืนยันคำสั่งขายจำลอง (Sell Sim)';

  const symEl = document.getElementById('sim-sheet-sym');
  if (symEl) symEl.textContent = `${window.simTradeState.activeAsset.sym} (${window.simTradeState.activeAsset.name})`;

  const priceEl = document.getElementById('sim-sheet-price');
  if (priceEl) priceEl.textContent = '฿' + window.simTradeState.activeAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2 });

  recalcSimOrder();
}

function closeSimOrderSheet() {
  const sheet = document.getElementById('sim-order-sheet');
  if (sheet) sheet.classList.add('hidden');
}

function setSimOrderPreset(val) {
  const input = document.getElementById('sim-order-thb-input');
  if (!input) return;
  if (val === 'ALL') {
    input.value = Math.max(100, Math.floor(window.simTradeState.virtualCash));
  } else {
    input.value = val;
  }
  recalcSimOrder();
}

function onSimOrderAmountChange(val) {
  recalcSimOrder();
}

function recalcSimOrder() {
  const input = document.getElementById('sim-order-thb-input');
  const amt = Math.max(0, parseFloat(input ? input.value : 0) || 0);
  const price = window.simTradeState.activeAsset.price || 1;
  const estUnits = (amt / price).toFixed(4);

  const estUnitsEl = document.getElementById('sim-sheet-est-units');
  if (estUnitsEl) estUnitsEl.textContent = `~${estUnits} หน่วย`;

  const totalEl = document.getElementById('sim-sheet-total');
  if (totalEl) totalEl.textContent = '฿' + amt.toLocaleString('en-US', { minimumFractionDigits: 2 });

  const remCash = window.simTradeState.tradeType === 'BUY'
    ? Math.max(0, window.simTradeState.virtualCash - amt)
    : (window.simTradeState.virtualCash + amt);

  const remCashEl = document.getElementById('sim-sheet-rem-cash');
  if (remCashEl) remCashEl.textContent = '฿' + remCash.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function executeSimVirtualOrder() {
  const input = document.getElementById('sim-order-thb-input');
  const amt = parseFloat(input ? input.value : 0) || 0;

  if (window.simTradeState.tradeType === 'BUY') {
    window.simTradeState.virtualCash = Math.max(0, window.simTradeState.virtualCash - amt);
  } else {
    window.simTradeState.virtualCash += amt;
  }

  const cashDisp = document.getElementById('sim-vtrade-cash-display');
  if (cashDisp) cashDisp.textContent = '฿' + window.simTradeState.virtualCash.toLocaleString('en-US', { minimumFractionDigits: 2 });

  closeSimOrderSheet();

  const modal = document.getElementById('modal-success');
  const desc = document.getElementById('success-desc');
  if (desc) {
    desc.textContent = `ส่งคำสั่ง${window.simTradeState.tradeType === 'BUY' ? 'ซื้อ' : 'ขาย'} ${window.simTradeState.activeAsset.sym} ด้วยเงินจำลอง ฿${amt.toLocaleString('en-US')} เรียบร้อยแล้ว (ไม่กระทบเงินจริง)`;
  }
  if (modal) modal.classList.remove('hidden');
}

// Global Exports
window.setSimInput = setSimInput;
window.startSimulation = startSimulation;
window.selectSimAsset = selectSimAsset;
window.hideSimAssetDetail = hideSimAssetDetail;
window.setSimFilterTab = setSimFilterTab;
window.filterSimItems = filterSimItems;
window.openSimTradingOrderSheet = openSimTradingOrderSheet;
window.closeSimOrderSheet = closeSimOrderSheet;
window.setSimOrderPreset = setSimOrderPreset;
window.onSimOrderAmountChange = onSimOrderAmountChange;
window.recalcSimOrder = recalcSimOrder;
window.executeSimVirtualOrder = executeSimVirtualOrder;

