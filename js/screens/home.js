/**
 * FINVEST Home Screen Controller
 */

function initHomeScreen() {
  // Setup real-time system clock
  updateSystemClock();
  setInterval(updateSystemClock, 30000);
}

function updateSystemClock() {
  const timeEl = document.getElementById('system-time');
  if (timeEl) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;
  }
}

window.initHomeScreen = initHomeScreen;

