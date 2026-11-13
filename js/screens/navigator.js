/**
 * FINVEST Navigator & Watchlist Controller
 * Manages asset discovery, search filtering, category filtering, and favorite watchlist sync.
 */

/**
 * Switch global investment mode (Real vs. Sim)
 * @param {'real' | 'sim'} mode
 */
function setAppMode(mode) {
  window.appState.mode = mode;
  const realBtn = document.getElementById('nav-mode-real-btn');
  const simBtn = document.getElementById('nav-mode-sim-btn');
  const banner = document.getElementById('navigator-balance-banner');
  const label = document.getElementById('nav-banner-label');
  const amount = document.getElementById('nav-banner-amount');

  if (mode === 'real') {
    if (realBtn) {
      realBtn.className = 'flex-1 py-2 px-3 rounded-xl bg-brand-navy text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition';
    }
    if (simBtn) {
      simBtn.className = 'flex-1 py-2 px-3 rounded-xl text-slate-600 font-bold text-xs flex items-center justify-center space-x-1.5 hover:text-slate-800 transition';
    }
    if (banner) {
      banner.className = 'p-2.5 px-3 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-between mb-3';
      label.textContent = 'ยอดเงินสดจริงพร้อมลงทุน:';
      label.className = 'text-[11px] text-brand-blue font-semibold';
      amount.textContent = '฿' + Number(window.appState.realCash).toLocaleString('en-US', { minimumFractionDigits: 2 });
      amount.className = 'font-bold font-num text-xs text-brand-navy';
    }
  } else {
    if (realBtn) {
      realBtn.className = 'flex-1 py-2 px-3 rounded-xl text-slate-600 font-bold text-xs flex items-center justify-center space-x-1.5 hover:text-slate-800 transition';
    }
    if (simBtn) {
      simBtn.className = 'flex-1 py-2 px-3 rounded-xl bg-brand-teal text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition';
    }
    if (banner) {
      banner.className = 'p-2.5 px-3 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-between mb-3';
      label.textContent = 'ยอดเงินสดจำลองคงเหลือ:';
      label.className = 'text-[11px] text-brand-teal font-semibold';
      amount.textContent = '฿' + Number(window.appState.simRemainingCash).toLocaleString('en-US', { minimumFractionDigits: 2 });
      amount.className = 'font-bold font-num text-xs text-brand-teal';
    }
  }
}

/**
 * Filter Assets by Text Query
 * @param {string} query
 */
function filterAssets(query) {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('.asset-row').forEach(row => {
    const sym = (row.getAttribute('data-symbol') || '').toLowerCase();
    const text = row.innerText.toLowerCase();
    if (sym.includes(q) || text.includes(q)) {
      row.style.display = 'flex';
    } else {
      row.style.display = 'none';
    }
  });
}

/**
 * Filter Assets by Category Pill
 * @param {string} cat - 'all' | 'us' | 'thai' | 'fund' | 'watchlist'
 * @param {HTMLElement} btn
 */
function setCategoryFilter(cat, btn) {
  document.querySelectorAll('.cat-pill').forEach(b => {
    b.className = 'cat-pill px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium shrink-0 flex items-center space-x-1';
  });

  if (btn) {
    btn.className = 'cat-pill px-3 py-1 rounded-full bg-brand-navy text-white font-semibold shrink-0 flex items-center space-x-1';
  }

  document.querySelectorAll('.asset-row').forEach(row => {
    const sym = row.getAttribute('data-symbol');
    if (cat === 'watchlist') {
      if (window.userWatchlist.has(sym)) {
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    } else if (cat === 'all' || row.getAttribute('data-category') === cat) {
      row.style.display = 'flex';
    } else {
      row.style.display = 'none';
    }
  });
}

/**
 * Watchlist Management
 */
function isAssetFavorited(symbol) {
  return window.userWatchlist.has(symbol);
}

function updateStarButtonUI(symbol) {
  const btn = document.getElementById('asset-detail-fav-btn');
  const star = document.getElementById('asset-detail-fav-star');
  if (!btn || !star) return;

  if (isAssetFavorited(symbol)) {
    btn.className = 'w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 z-10 tap-active transition border border-amber-200 shadow-sm';
    star.className = 'text-lg leading-none select-none text-amber-800';
    btn.setAttribute('title', 'อยู่ในรายการที่สนใจแล้ว (แตะเพื่อยกเลิก)');
  } else {
    btn.className = 'w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 z-10 tap-active transition border border-slate-200';
    star.className = 'text-base leading-none select-none text-slate-400';
    btn.setAttribute('title', 'แตะเพื่อบันทึกเป็นรายการที่สนใจ');
  }
}

function toggleAssetFavorite() {
  const sym = window.appState.selectedAsset ? window.appState.selectedAsset.symbol : 'SPY';
  const isFav = isAssetFavorited(sym);

  if (isFav) {
    window.userWatchlist.delete(sym);
    if (typeof showWatchlistToast === 'function') {
      showWatchlistToast(`ยกเลิกรายการที่สนใจแล้ว (${sym})`, false);
    }
  } else {
    window.userWatchlist.add(sym);
    if (typeof showWatchlistToast === 'function') {
      showWatchlistToast(`บันทึก ${sym} ในรายการที่สนใจแล้ว`, true);
    }
  }

  updateStarButtonUI(sym);
  syncWatchlistIndicators();
}

function syncWatchlistIndicators() {
  const badge = document.getElementById('watchlist-count-badge');
  if (badge) {
    badge.textContent = window.userWatchlist.size;
  }

  document.querySelectorAll('.asset-row').forEach(row => {
    const sym = row.getAttribute('data-symbol');
    const existingStar = row.querySelector('.asset-star-icon');
    if (window.userWatchlist.has(sym)) {
      if (!existingStar) {
        const title = row.querySelector('h4');
        if (title) {
          const s = document.createElement('span');
          s.className = 'text-amber-800 text-[10px] ml-1 asset-star-icon inline-block select-none';
          s.textContent = '★';
          title.appendChild(s);
        }
      }
    } else {
      if (existingStar) existingStar.remove();
    }
  });

  updateOrderWatchlistChips();
}

function updateOrderWatchlistChips() {
  const container = document.getElementById('order-watchlist-chips');
  if (!container) return;

  container.innerHTML = '';
  if (window.userWatchlist.size === 0) {
    container.innerHTML = '<span class="text-[10px] text-amber-900 py-1">ยังไม่มีสินทรัพย์ในรายการที่สนใจ</span>';
    return;
  }

  window.userWatchlist.forEach(sym => {
    const meta = window.assetCatalog[sym] || {
      name: sym,
      price: '฿1,000.00',
      change: '0.00%',
      risk: 'ปานกลาง',
      cat: 'Stock'
    };

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-[11px] font-bold text-brand-navy flex items-center space-x-1 tap-active shrink-0 shadow-xs hover:border-amber-400';
    btn.onclick = function() {
      switchOrderAsset(sym, meta.name, meta.price, meta.change, meta.risk, meta.cat);
    };
    btn.innerHTML = `<span class="text-amber-800 leading-none">★</span><span>${sym}</span><span class="font-num text-[10px] text-slate-500 ml-1">${meta.price.replace('.00', '')}</span>`;
    container.appendChild(btn);
  });
}

function switchOrderAsset(symbol, name, price, change, risk, category) {
  window.appState.selectedAsset = {
    symbol,
    name,
    price,
    priceNum: parseFloat(price.replace(/[^0-9.-]+/g, '')),
    change,
    risk,
    category
  };

  const orderSym = document.getElementById('order-symbol');
  const orderPriceUnit = document.getElementById('order-price-unit');
  if (orderSym) orderSym.textContent = `${symbol} (${name})`;
  if (orderPriceUnit) orderPriceUnit.textContent = price;

  if (typeof recalcOrderTotal === 'function') recalcOrderTotal();
}

// Global Exports
window.setAppMode = setAppMode;
window.filterAssets = filterAssets;
window.setCategoryFilter = setCategoryFilter;
window.isAssetFavorited = isAssetFavorited;
window.updateStarButtonUI = updateStarButtonUI;
window.toggleAssetFavorite = toggleAssetFavorite;
window.syncWatchlistIndicators = syncWatchlistIndicators;
window.updateOrderWatchlistChips = updateOrderWatchlistChips;
window.switchOrderAsset = switchOrderAsset;

