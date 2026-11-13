/**
 * FINVEST Navigation & Screen Router
 * Manages screen transitions, tab synchronization, back-stack, and nav visibility.
 */

const HIDE_NAV_SCREENS = new Set([
  'screen-ai-coach',
  'screen-macro-scenario',
  'screen-sim-summary',
  'screen-login',
  'screen-register'
]);

const TAB_ROUTES = {
  'tab-home': ['screen-home'],
  'tab-nav': ['screen-navigator', 'screen-asset-detail'],
  'tab-real': ['screen-real-portfolio', 'screen-real-summary'],
  'tab-sim': ['screen-simulator-setup', 'screen-sim-summary', 'screen-macro-scenario', 'screen-ai-coach'],
  'tab-profile': ['screen-profile']
};

/**
 * Navigate to a specific screen
 * @param {string} screenId - Target screen section ID
 * @param {object} [options] - Navigation options (e.g. { fromHome: true })
 */
function navTo(screenId, options = {}) {
  const activeScreen = document.querySelector('.screen-view.active');
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) {
    console.warn(`Screen ${screenId} not found.`);
    return;
  }

  // Record history
  if (activeScreen && activeScreen.id !== screenId) {
    window.appState.previousScreen = activeScreen.id;
  }

  // Handle fromHome logic
  if (screenId === 'screen-navigator') {
    if (options.fromHome === true || (options.fromHome === undefined && window.appState.previousScreen === 'screen-home')) {
      window.appState.cameFromHome = true;
    } else if (options.fromHome === false) {
      window.appState.cameFromHome = false;
    }
  } else if (screenId === 'screen-home') {
    window.appState.cameFromHome = false;
  }

  // Switch active classes
  document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
  targetScreen.classList.add('active');

  // Close trading overlay modal if open
  const simTradeModal = document.getElementById('modal-sim-trading');
  if (simTradeModal) simTradeModal.classList.add('hidden');

  // Scroll to top
  const container = targetScreen.querySelector('.overflow-y-auto') || targetScreen;
  if (container) container.scrollTop = 0;
  window.scrollTo(0, 0);

  // Sync Navigator back button
  const navBackBtn = document.getElementById('navigator-back-btn');
  if (navBackBtn) {
    if (screenId === 'screen-navigator' && window.appState.cameFromHome) {
      navBackBtn.classList.remove('hidden');
    } else {
      navBackBtn.classList.add('hidden');
    }
  }

  // Sync Bottom Tabs & Nav Visibility
  syncNavTabs(screenId);
  updateNavVisibility(screenId);
}

/**
 * Synchronize bottom navigation tab styling
 */
function syncNavTabs(screenId) {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('text-brand-navy', 'text-brand-teal', 'text-slate-900', 'font-bold');
    tab.classList.add('text-slate-400', 'font-medium');
  });

  let activeTabId = null;
  for (const [tabId, screens] of Object.entries(TAB_ROUTES)) {
    if (screens.includes(screenId)) {
      activeTabId = tabId;
      break;
    }
  }

  if (!activeTabId) {
    const active = document.querySelector('.screen-view.active');
    if (active) {
      for (const [tabId, screens] of Object.entries(TAB_ROUTES)) {
        if (screens.includes(active.id)) {
          activeTabId = tabId;
          break;
        }
      }
    }
  }

  if (!activeTabId) activeTabId = 'tab-home';

  const activeTab = document.getElementById(activeTabId);
  if (activeTab) {
    activeTab.classList.remove('text-slate-400', 'font-medium');
    activeTab.classList.add('text-brand-navy', 'font-bold');
  }
}

/**
 * Show or hide bottom floating navigation bar depending on screen
 */
function updateNavVisibility(screenId) {
  const nav = document.getElementById('bottom-nav-bar');
  if (!nav) return;

  const currentId = screenId || (document.querySelector('.screen-view.active') ? document.querySelector('.screen-view.active').id : null);
  const simTradeModal = document.getElementById('modal-sim-trading');
  const isTradeActive = simTradeModal && !simTradeModal.classList.contains('hidden');
  const isTargetScreen = currentId && HIDE_NAV_SCREENS.has(currentId);

  if (isTradeActive || isTargetScreen) {
    nav.style.display = 'none';
  } else {
    nav.style.display = 'flex';
  }
}

/**
 * Handle Back navigation from Navigator
 */
function goBackFromNavigator() {
  window.appState.cameFromHome = false;
  const navBackBtn = document.getElementById('navigator-back-btn');
  if (navBackBtn) navBackBtn.classList.add('hidden');
  navTo('screen-home');
}

/**
 * Handle Back navigation from Asset Detail / Trading Screen
 */
function goBackFromTradingScreen() {
  if (window.appState.assetOrigin === 'screen-home' || window.appState.cameFromHome) {
    window.appState.assetOrigin = null;
    window.appState.cameFromHome = false;
    navTo('screen-home');
  } else if (window.appState.assetOrigin) {
    const origin = window.appState.assetOrigin;
    window.appState.assetOrigin = null;
    navTo(origin);
  } else {
    navTo('screen-navigator');
  }
}

function goBackFromAssetDetail() {
  goBackFromTradingScreen();
}

// Global Exports
window.navTo = navTo;
window.goToScreen = navTo;
window.syncNavTabs = syncNavTabs;
window.updateNavVisibility = updateNavVisibility;
window.goBackFromNavigator = goBackFromNavigator;
window.goBackFromTradingScreen = goBackFromTradingScreen;
window.goBackFromAssetDetail = goBackFromAssetDetail;

