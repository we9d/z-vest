/**
 * FINVEST Asset Detail & Unified Trading Screen Controller
 * Handles asset price display, real/sim switching, buy/sell action tabs, and order calculation.
 */

window.currentTradeAction = 'BUY';
window.tradingScreenMode = 'sim';

/**
 * Open Asset Detail Screen with Asset Data
 */
function openAssetDetail(symbol, name, price, change, risk, category, origin) {
  const active = document.querySelector('.screen-view.active');
  window.appState.assetOrigin = origin || (active ? active.id : 'screen-home');
  if (window.appState.assetOrigin === 'screen-home') {
    window.appState.cameFromHome = true;
  }

  const priceNum = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.-]+/g, '')) || 0;
  const priceFormatted = typeof price === 'string' && price.startsWith('฿') ? price : '฿' + priceNum.toLocaleString('en-US', { minimumFractionDigits: 2 });

  window.appState.selectedAsset = {
    symbol,
    name,
    price: priceFormatted,
    priceNum,
    change,
    risk,
    category
  };

  const symEl = document.getElementById('detail-symbol');
  const nameEl = document.getElementById('detail-name');
  const priceEl = document.getElementById('detail-price');
  const changeEl = document.getElementById('detail-change');
  const riskEl = document.getElementById('detail-risk');

  if (symEl) symEl.textContent = symbol;
  if (nameEl) nameEl.textContent = name;
  if (priceEl) priceEl.textContent = priceFormatted;
  if (changeEl) changeEl.textContent = change;
  if (riskEl) riskEl.textContent = risk;

  if (typeof updateStarButtonUI === 'function') {
    updateStarButtonUI(symbol);
  }

  setDetailMode(window.appState.mode);
  setTradeActionTab(window.currentTradeAction || 'BUY');

  navTo('screen-asset-detail');
}

/**
 * Toggle Real vs. Simulator mode within Asset Detail
 * @param {'real' | 'sim'} mode
 */
function setDetailMode(mode) {
  window.appState.mode = mode;
  const btnReal = document.getElementById('detail-btn-real');
  const btnSim = document.getElementById('detail-btn-sim');
  const balanceLabel = document.getElementById('detail-balance-label');
  const balanceVal = document.getElementById('detail-balance-val');
  const buyBtn = document.getElementById('detail-buy-action-btn');

  if (mode === 'real') {
    if (btnReal) btnReal.className = 'flex-1 py-2 px-2 rounded-xl bg-brand-navy text-white shadow-xs transition text-center';
    if (btnSim) btnSim.className = 'flex-1 py-2 px-2 rounded-xl text-slate-600 transition text-center';
    if (balanceLabel) balanceLabel.textContent = 'ยอดเงินสดจริงพร้อมซื้อ (Real Cash)';
    if (balanceVal) {
      balanceVal.textContent = '฿' + Number(window.appState.realCash).toLocaleString('en-US', { minimumFractionDigits: 2 });
      balanceVal.className = 'font-bold text-brand-navy font-num';
    }
    if (buyBtn) {
      buyBtn.textContent = 'ซื้อจริง';
      buyBtn.className = 'tap-active py-3 rounded-2xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm shadow-md transition text-center';
    }
  } else {
    if (btnReal) btnReal.className = 'flex-1 py-2 px-2 rounded-xl text-slate-600 transition text-center';
    if (btnSim) btnSim.className = 'flex-1 py-2 px-2 rounded-xl bg-brand-teal text-white shadow-xs transition text-center';
    if (balanceLabel) balanceLabel.textContent = 'ยอดเงินสดจำลองคงเหลือ (Virtual Cash)';
    if (balanceVal) {
      balanceVal.textContent = '฿' + Number(window.appState.simRemainingCash).toLocaleString('en-US', { minimumFractionDigits: 2 });
      balanceVal.className = 'font-bold text-brand-teal font-num';
    }
    if (buyBtn) {
      buyBtn.textContent = 'ซื้อจำลอง';
      buyBtn.className = 'tap-active py-3 rounded-2xl bg-brand-teal hover:bg-teal-500 text-white font-bold text-sm shadow-md transition text-center';
    }
  }

  updateDetailTradeTotal();
}

/**
 * Toggle Buy / Sell tab in unified screen
 * @param {'BUY' | 'SELL'} action
 */
function setTradeActionTab(action) {
  window.currentTradeAction = action;
  const buyTab = document.getElementById('trade-tab-buy');
  const sellTab = document.getElementById('trade-tab-sell');
  const label = document.getElementById('trade-input-label');
  const submitBtn = document.getElementById('detail-main-submit-btn');
  const heldBadge = document.getElementById('detail-shares-held-badge');
  const availInfo = document.getElementById('trade-available-info');

  const sym = window.appState.selectedAsset ? window.appState.selectedAsset.symbol : 'SPY';
  const held = window.heldAssetsData[sym] ? window.heldAssetsData[sym].heldQty : 12;

  if (heldBadge) {
    heldBadge.textContent = `ถือครอง ${held.toLocaleString('en-US')} หน่วย`;
  }

  if (action === 'SELL') {
    if (buyTab) buyTab.className = 'py-2 rounded-xl text-slate-600 hover:text-slate-900 transition text-center font-bold';
    if (sellTab) sellTab.className = 'py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shadow-xs transition text-center font-bold';
    if (label) label.textContent = `จำนวนหน่วยที่ต้องการขาย (สูงสุด ${held} หน่วย)`;
    if (availInfo) availInfo.textContent = `หน่วยที่มีในพอร์ต: ${held} หน่วย`;
    if (submitBtn) {
      submitBtn.className = 'tap-active w-full py-3.5 rounded-2xl bg-rose-50 hover:bg-brand-red/20 text-rose-600 border border-rose-200 font-bold text-sm shadow-md transition flex items-center justify-center space-x-1.5';
      submitBtn.innerHTML = `<span>ยืนยันคำสั่งขาย (${sym})</span>`;
    }
  } else {
    if (buyTab) buyTab.className = 'py-2 rounded-xl bg-brand-teal text-white shadow-xs transition text-center font-bold';
    if (sellTab) sellTab.className = 'py-2 rounded-xl text-slate-600 hover:text-slate-900 transition text-center font-bold';
    if (label) label.textContent = 'จำนวนหน่วยที่ต้องการซื้อ';
    if (availInfo) {
      availInfo.textContent = window.appState.mode === 'real'
        ? `เงินสดพร้อมใช้: ฿${Number(window.appState.realCash).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : `เงินสดจำลอง: ฿${Number(window.appState.simRemainingCash).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
    if (submitBtn) {
      const bgClass = window.appState.mode === 'real' ? 'bg-brand-navy hover:bg-slate-800' : 'bg-brand-teal hover:bg-teal-500';
      submitBtn.className = `tap-active w-full py-3.5 rounded-2xl ${bgClass} text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-1.5`;
      submitBtn.innerHTML = `<span>ยืนยันคำสั่งซื้อ (${window.appState.mode === 'real' ? 'เงินจริง' : 'จำลอง'})</span>`;
    }
  }

  updateDetailTradeTotal();
}

function adjustDetailTradeUnits(delta) {
  const input = document.getElementById('detail-trade-units-input');
  if (!input) return;
  const current = parseFloat(input.value) || 1;
  const sym = window.appState.selectedAsset ? window.appState.selectedAsset.symbol : 'SPY';
  const maxHeld = window.heldAssetsData[sym] ? window.heldAssetsData[sym].heldQty : 100;
  let next = Math.max(1, current + delta);
  if (window.currentTradeAction === 'SELL') next = Math.min(next, maxHeld);
  input.value = next;
  updateDetailTradeTotal();
}

function setDetailTradePreset(val) {
  const input = document.getElementById('detail-trade-units-input');
  if (!input) return;
  const sym = window.appState.selectedAsset ? window.appState.selectedAsset.symbol : 'SPY';
  const maxHeld = window.heldAssetsData[sym] ? window.heldAssetsData[sym].heldQty : 12;
  if (val === 'MAX') {
    input.value = window.currentTradeAction === 'SELL' ? maxHeld : 5;
  } else {
    input.value = val;
  }
  updateDetailTradeTotal();
}

function onDetailTradeUnitsChanged(val) {
  updateDetailTradeTotal();
}

function updateDetailTradeTotal() {
  const input = document.getElementById('detail-trade-units-input');
  const totalEl = document.getElementById('detail-trade-total-val');
  if (!input || !totalEl) return;

  const units = parseFloat(input.value) || 0;
  const price = window.appState.selectedAsset ? window.appState.selectedAsset.priceNum : 19550;
  const total = units * price;
  totalEl.textContent = '฿' + total.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function submitDetailTradeOrder() {
  openOrderModal(window.currentTradeAction || 'BUY');
}

/**
 * Unified Trading Modal Launcher
 */
function openUnifiedTradingScreen(mode = 'sim', defaultAction = 'BUY', symbol = 'SPY') {
  window.tradingScreenMode = mode;
  setAppMode(mode);

  const titleEl = document.getElementById('trading-screen-title');
  const cashLabel = document.getElementById('trading-cash-label');
  const cashBadge = document.getElementById('trading-cash-badge');
  const cashDisp = document.getElementById('trading-cash-display');
  const sellLabel = document.getElementById('trading-card-sell-label');
  const buyLabel = document.getElementById('trading-card-buy-label');

  if (mode === 'real') {
    if (titleEl) titleEl.textContent = 'การซื้อขายสินทรัพย์';
    if (cashLabel) cashLabel.textContent = 'ยอดเงินสดจริงพร้อมซื้อขาย';
    if (cashBadge) {
      cashBadge.textContent = 'พอร์ตลงทุนจริง';
      cashBadge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-brand-navy border border-blue-200';
    }
    if (cashDisp) cashDisp.textContent = '฿' + Number(window.appState.realCash).toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (sellLabel) sellLabel.textContent = 'ขายสินทรัพย์';
    if (buyLabel) buyLabel.textContent = 'ซื้อสินทรัพย์';
  } else {
    if (titleEl) titleEl.textContent = 'การจำลองการซื้อขาย';
    if (cashLabel) cashLabel.textContent = 'ยอดเงินสดจำลองพร้อมซื้อขาย';
    if (cashBadge) {
      cashBadge.textContent = '100% ไร้ความเสี่ยง';
      cashBadge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/10';
    }
    if (cashDisp) cashDisp.textContent = '฿' + (window.simTradeState ? window.simTradeState.virtualCash.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '14,000.00');
    if (sellLabel) sellLabel.textContent = 'ขายจำลอง';
    if (buyLabel) buyLabel.textContent = 'ซื้อจำลอง';
  }

  const targetSym = symbol || (mode === 'real' ? 'SPY' : 'NVDA');
  const asset = window.assetCatalog[targetSym] || window.assetCatalog['SPY'];

  if (typeof selectSimAsset === 'function') {
    selectSimAsset(targetSym, asset.name, asset.priceNum, asset.change, asset.cat, asset.tag, asset.code, asset.range, asset.pe, asset.vol);
  }

  const modal = document.getElementById('modal-sim-trading');
  if (modal) modal.classList.remove('hidden');

  updateNavVisibility();

  if (defaultAction) {
    setTimeout(() => {
      openTradingOrderSheet(defaultAction);
    }, 150);
  }
}

function openTradingOrderSheet(type) {
  if (window.tradingScreenMode === 'real') {
    openRealTradingOrderSheet(type);
  } else {
    if (typeof openSimTradingOrderSheet === 'function') {
      openSimTradingOrderSheet(type);
    }
  }
}

function openRealTradingOrderSheet(type) {
  window.simTradeState.tradeType = type;
  const sheet = document.getElementById('sim-order-sheet');
  if (!sheet) return;
  sheet.classList.remove('hidden');

  const title = document.getElementById('sim-order-sheet-title');
  if (title) title.textContent = type === 'BUY' ? 'ยืนยันคำสั่งซื้อจริง (Buy Real)' : 'ยืนยันคำสั่งขายจริง (Sell Real)';

  const notice = sheet.querySelector('.bg-teal-50');
  if (notice) {
    notice.className = 'p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-brand-blue font-bold flex items-center space-x-2';
    notice.innerHTML = '<span>🔵 คำสั่งซื้อขายในโหมดพอร์ตจริง (หัก/รับยอดเงินจริง)</span>';
  }

  const btn = document.getElementById('sim-confirm-order-btn');
  if (btn) {
    btn.className = 'tap-active w-full py-3.5 rounded-2xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm shadow-md transition';
    btn.textContent = type === 'BUY' ? 'ยืนยันส่งคำสั่งซื้อจริง' : 'ยืนยันส่งคำสั่งขายจริง';
  }

  const symEl = document.getElementById('sim-sheet-sym');
  if (symEl) symEl.textContent = `${window.simTradeState.activeAsset.sym} (${window.simTradeState.activeAsset.name})`;

  const priceEl = document.getElementById('sim-sheet-price');
  if (priceEl) priceEl.textContent = '฿' + window.simTradeState.activeAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2 });

  if (typeof recalcSimOrder === 'function') recalcSimOrder();
}

// Global Exports
window.openAssetDetail = openAssetDetail;
window.setDetailMode = setDetailMode;
window.setTradeActionTab = setTradeActionTab;
window.adjustDetailTradeUnits = adjustDetailTradeUnits;
window.setDetailTradePreset = setDetailTradePreset;
window.onDetailTradeUnitsChanged = onDetailTradeUnitsChanged;
window.updateDetailTradeTotal = updateDetailTradeTotal;
window.submitDetailTradeOrder = submitDetailTradeOrder;
window.openUnifiedTradingScreen = openUnifiedTradingScreen;
window.openTradingOrderSheet = openTradingOrderSheet;
window.openRealTradingOrderSheet = openRealTradingOrderSheet;

