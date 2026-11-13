/**
 * FINVEST Portfolio Screen Controller
 * Handles Real Portfolio and Simulator Summary views.
 */

function openRealPortfolioTrading(action = 'BUY', symbol = 'SPY') {
  setAppMode('real');
  window.appState.assetOrigin = 'screen-real-portfolio';
  window.appState.previousScreen = 'screen-real-portfolio';

  if (typeof openUnifiedTradingScreen === 'function') {
    openUnifiedTradingScreen('real', action, symbol);
  } else {
    const asset = window.heldAssetsData[symbol] || window.heldAssetsData['SPY'];
    openAssetDetail(symbol, asset.name, asset.price, asset.change, asset.risk, asset.cat, 'screen-real-portfolio');
    if (typeof setTradeActionTab === 'function') {
      setTradeActionTab(action);
    }
  }
}

function switchPortfolioTab(tabName) {
  document.querySelectorAll('.portfolio-tab-pill').forEach(btn => {
    btn.className = 'portfolio-tab-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 transition';
  });

  const activeTab = document.getElementById(`tab-port-${tabName}`);
  if (activeTab) {
    activeTab.className = 'portfolio-tab-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-navy text-white transition';
  }

  document.querySelectorAll('.port-holding-item').forEach(item => {
    const cat = item.getAttribute('data-category');
    if (tabName === 'all' || cat === tabName) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

window.openRealPortfolioTrading = openRealPortfolioTrading;
window.switchPortfolioTab = switchPortfolioTab;

