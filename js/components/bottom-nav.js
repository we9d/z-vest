/**
 * FINVEST Bottom Navigation Controller
 */

function setupBottomNav() {
  const tabs = [
    { id: 'tab-home', screen: 'screen-home' },
    { id: 'tab-nav', screen: 'screen-navigator', options: { fromHome: false } },
    { id: 'tab-real', screen: 'screen-real-portfolio' },
    { id: 'tab-sim', screen: 'screen-simulator-setup' },
    { id: 'tab-profile', screen: 'screen-profile' }
  ];

  tabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) {
      el.addEventListener('click', () => {
        navTo(t.screen, t.options || {});
      });
    }
  });
}

window.setupBottomNav = setupBottomNav;

