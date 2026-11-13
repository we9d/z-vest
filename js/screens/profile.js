/**
 * FINVEST Profile & Settings Controller
 */

function handleLogout() {
  if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
    if (typeof showWatchlistToast === 'function') {
      showWatchlistToast('ออกจากระบบเรียบร้อยแล้ว', false);
    }
    setTimeout(() => {
      navTo('screen-login');
    }, 400);
  }
}

window.handleLogout = handleLogout;

