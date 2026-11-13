/**
 * FINVEST Master Application Entrypoint
 * Bootstraps state, routers, components, and screen controllers.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing FINVEST App...');

  // 1. Initialize Home screen & clock
  if (typeof initHomeScreen === 'function') {
    initHomeScreen();
  }

  // 2. Initialize Bottom Navigation
  if (typeof setupBottomNav === 'function') {
    setupBottomNav();
  }

  // 3. Initialize Watchlist indicators & star buttons
  if (typeof updateStarButtonUI === 'function') {
    updateStarButtonUI('SPY');
  }
  if (typeof syncWatchlistIndicators === 'function') {
    syncWatchlistIndicators();
  }

  // 4. Initialize Macro Scenarios
  if (typeof updateCardVisuals === 'function') {
    updateCardVisuals();
  }
  if (typeof recalcMacroScenarios === 'function') {
    recalcMacroScenarios();
  }

  // 5. Initialize Active Screen & Navigation
  const activeScreen = document.querySelector('.screen-view.active');
  const initialScreenId = activeScreen ? activeScreen.id : 'screen-home';

  if (typeof syncNavTabs === 'function') {
    syncNavTabs(initialScreenId);
  }
  if (typeof updateNavVisibility === 'function') {
    updateNavVisibility(initialScreenId);
  }

  // 6. Bind form listeners for Auth
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof handleLoginSubmit === 'function') handleLoginSubmit(e);
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof handleRegisterSuccess === 'function') handleRegisterSuccess(e);
    });
  }

  console.log('✅ FINVEST App initialized successfully.');
});

