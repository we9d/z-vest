/**
 * FINVEST Authentication Controller (Login & Registration)
 */

function toggleAuthForm(mode) {
  const loginCard = document.getElementById('auth-login-card');
  const registerCard = document.getElementById('auth-register-card');

  if (mode === 'register') {
    if (loginCard) loginCard.classList.add('hidden');
    if (registerCard) registerCard.classList.remove('hidden');
  } else {
    if (registerCard) registerCard.classList.add('hidden');
    if (loginCard) loginCard.classList.remove('hidden');
  }
}

function togglePasswordVisibility(fieldId, btn) {
  const input = document.getElementById(fieldId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.classList.add('text-brand-teal');
  } else {
    input.type = 'password';
    if (btn) btn.classList.remove('text-brand-teal');
  }
}

function handleLoginSubmit(event) {
  if (event) event.preventDefault();
  if (typeof showWatchlistToast === 'function') {
    showWatchlistToast('เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ', true);
  }
  setTimeout(() => {
    navTo('screen-home');
  }, 400);
}

function handleRegisterSuccess(event) {
  if (event) event.preventDefault();
  if (typeof showWatchlistToast === 'function') {
    showWatchlistToast('ลงทะเบียนสำเร็จ! บัญชีของคุณพร้อมใช้งาน', true);
  }
  setTimeout(() => {
    navTo('screen-home');
  }, 600);
}

// Global Exports
window.toggleAuthForm = toggleAuthForm;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleLoginSubmit = handleLoginSubmit;
window.handleRegisterSuccess = handleRegisterSuccess;

