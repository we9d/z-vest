/**
 * FINVEST Macro Scenario Simulation Engine
 * Performs multi-factor macroeconomic stress tests and portfolio sensitivity analysis.
 */

function updateCardVisuals() {
  ['inflation', 'rate_hike', 'recession', 'market_crash'].forEach(key => {
    const card = document.getElementById('scen-card-' + key);
    if (!card) return;

    const isSelected = window.selectedMacroScenarios.has(key);
    const titleDiv = card.querySelector('div.font-bold');
    const subSpan = card.querySelectorAll('span')[1];
    const checkSpan = card.querySelector('.scen-check');

    if (isSelected) {
      card.className = 'macro-scen-card tap-active p-3 rounded-2xl border text-left bg-teal-50 border-brand-teal shadow-xs transition relative';
      if (titleDiv) titleDiv.className = 'font-bold text-brand-navy text-xs';
      if (subSpan) subSpan.className = 'text-[10px] text-brand-teal font-medium block mt-0.5';
      if (checkSpan) {
        checkSpan.className = 'scen-check w-4 h-4 rounded-full bg-brand-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0';
        checkSpan.textContent = '✓';
      }
    } else {
      card.className = 'macro-scen-card tap-active p-3 rounded-2xl border text-left bg-white border-slate-200 hover:border-brand-teal transition relative';
      if (titleDiv) titleDiv.className = 'font-bold text-slate-800 text-xs';
      if (subSpan) subSpan.className = 'text-[10px] text-slate-400 font-medium block mt-0.5';
      if (checkSpan) {
        checkSpan.className = 'scen-check w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-transparent shrink-0';
        checkSpan.textContent = '✓';
      }
    }
  });
}

function recalcMacroScenarios() {
  const selectedList = Array.from(window.selectedMacroScenarios);
  const tEl = document.getElementById('macro-detail-title');
  const bEl = document.getElementById('macro-detail-badge');
  const impEl = document.getElementById('macro-impact-badge');
  const dEl = document.getElementById('macro-detail-desc');
  const aEl = document.getElementById('macro-after-val');
  const dfEl = document.getElementById('macro-diff-val');
  const listEl = document.getElementById('macro-breakdown-list');

  const BASE_PORTFOLIO = window.BASE_MACRO_PORTFOLIO || 54320.00;
  const SCENARIOS = window.macroScenarioConfig.data;

  if (selectedList.length === 0) {
    if (tEl) tEl.textContent = 'ยังไม่ได้เลือกสถานการณ์';
    if (bEl) bEl.textContent = 'แตะสถานการณ์ด้านบนเพื่อดูการจำลองผลกระทบ';
    if (impEl) impEl.textContent = '0.0% ผลกระทบ';
    if (dEl) dEl.textContent = 'เลือกสถานการณ์เศรษฐกิจอย่างน้อย 1 ปัจจัย เพื่อจำลองการทดสอบภาวะวิกฤต (Stress Test) ต่อพอร์ตของคุณ';
    if (aEl) aEl.textContent = '฿' + BASE_PORTFOLIO.toLocaleString('en-US', { minimumFractionDigits: 2 });
    if (dfEl) dfEl.textContent = '฿0.00 (0.0%)';
    if (listEl) {
      listEl.innerHTML = '<div class="p-2 text-center text-xs text-slate-400">ยังไม่มีผลกระทบ (ยังไม่ได้เลือกสถานการณ์)</div>';
    }
    return;
  }

  let combinedMultiplier = 1;
  let totalUsImpact = 0;
  let totalThImpact = 0;
  let totalFundImpact = 0;
  let maxRecovery = 1;
  const names = [];
  const advices = [];

  selectedList.forEach(key => {
    const s = SCENARIOS[key];
    if (!s) return;
    names.push(s.name);
    combinedMultiplier *= (1 + (s.impactPct / 100));
    totalUsImpact += s.usImpact;
    totalThImpact += s.thImpact;
    totalFundImpact += s.fundImpact;
    if (s.recoveryMonths > maxRecovery) maxRecovery = s.recoveryMonths;
    advices.push(s.advice);
  });

  const combinedPct = ((combinedMultiplier - 1) * 100);
  const projectedVal = BASE_PORTFOLIO * combinedMultiplier;
  const diffVal = projectedVal - BASE_PORTFOLIO;

  if (tEl) {
    tEl.textContent = selectedList.length === 1 ? ('สถานการณ์: ' + SCENARIOS[selectedList[0]].name) : ('สถานการณ์ร่วม: ' + names.join(' + '));
  }
  if (bEl) {
    bEl.textContent = selectedList.length === 1 ? SCENARIOS[selectedList[0]].badge : ('จำลองภาวะวิกฤตซ้อนทับ ' + selectedList.length + ' ปัจจัยพร้อมกัน');
  }
  if (impEl) {
    impEl.textContent = (combinedPct.toFixed(1)) + '% ผลกระทบรวม';
  }
  if (dEl) {
    if (selectedList.length === 1) {
      dEl.textContent = SCENARIOS[selectedList[0]].desc;
    } else {
      dEl.textContent = 'การเกิดสถานการณ์ ' + names.join(' ร่วมกับ ') + ' พร้อมกัน ส่งผลกระทบเชิงทวีคูณต่อสินทรัพย์เสี่ยงโดยรวม โดยเฉพาะกลุ่มหุ้นเทคโนโลยีที่มีความอ่อนไหวสูง';
    }
  }
  if (aEl) aEl.textContent = '฿' + projectedVal.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (dfEl) {
    dfEl.textContent = '▼ ฿' + Math.abs(diffVal).toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' (' + combinedPct.toFixed(1) + '%)';
  }
  if (listEl) {
    const usPctStr = Math.max(-45, totalUsImpact).toFixed(1) + '%';
    const thPctStr = Math.max(-35, totalThImpact).toFixed(1) + '%';
    const fundPctStr = Math.max(-30, totalFundImpact).toFixed(1) + '%';
    listEl.innerHTML = `
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50">
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-brand-blue shrink-0"></span>
          <span class="font-sans text-slate-700">หุ้นสหรัฐฯ (Tech ETFs & Growth)</span>
        </div>
        <span class="font-bold text-brand-red">${usPctStr}</span>
      </div>
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50">
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-brand-navy shrink-0"></span>
          <span class="font-sans text-slate-700">หุ้นไทย (SET50 / Domestic)</span>
        </div>
        <span class="font-bold text-brand-red">${thPctStr}</span>
      </div>
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50">
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-brand-teal shrink-0"></span>
          <span class="font-sans text-slate-700">กองทุนรวม & ตราสารหนี้</span>
        </div>
        <span class="font-bold text-brand-red">${fundPctStr}</span>
      </div>
      <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50">
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
          <span class="font-sans text-slate-700">เงินสดจำลอง (Cash Reserve)</span>
        </div>
        <span class="font-bold text-emerald-600">0.0% (ปลอดภัย)</span>
      </div>
    `;
  }

  const projValEl = document.getElementById('macro-result-projected-val');
  const diffPill = document.getElementById('macro-result-diff-pill');
  const recTime = document.getElementById('macro-result-recovery-time');
  const adviceEl = document.getElementById('macro-result-ai-advice');
  const statusTag = document.getElementById('macro-result-status-tag');

  if (projValEl) projValEl.textContent = '฿' + projectedVal.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (diffPill) diffPill.textContent = '-฿' + Math.abs(diffVal).toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' (' + combinedPct.toFixed(1) + '%)';
  if (recTime) recTime.textContent = '~ ' + (maxRecovery * (selectedList.length > 1 ? 1.25 : 1)).toFixed(1) + ' เดือน';
  if (adviceEl) adviceEl.textContent = advices.join(' ');
  if (statusTag) statusTag.textContent = selectedList.length + ' สถานการณ์ร่วม';
}

function toggleDedicatedScenario(key) {
  if (window.selectedMacroScenarios.has(key)) {
    window.selectedMacroScenarios.delete(key);
  } else {
    window.selectedMacroScenarios.add(key);
  }
  updateCardVisuals();
  recalcMacroScenarios();
}

function setDedicatedScenario(key) {
  toggleDedicatedScenario(key);
}

function runMacroScenarioSimulation() {
  const btn = document.getElementById('btn-run-macro-sim');
  const resultBox = document.getElementById('macro-sim-result-box');
  if (!btn) return;

  btn.disabled = true;
  btn.className = 'w-full py-3.5 rounded-2xl bg-brand-navy text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-wait';
  btn.innerHTML = '<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span><span>กำลังจำลองผลกระทบต่อพอร์ต...</span>';

  setTimeout(() => {
    btn.disabled = false;
    btn.className = 'tap-active w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5';
    btn.innerHTML = `
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>ประมวลผลแล้ว (แตะเพื่อทดสอบใหม่)</span>
    `;

    recalcMacroScenarios();

    if (resultBox) {
      resultBox.classList.remove('hidden');
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (typeof showWatchlistToast === 'function') {
      showWatchlistToast('จำลองสถานการณ์และคำนวณผลกระทบเรียบร้อยแล้ว', true);
    }
  }, 650);
}

function resetMacroSimulationState() {
  const btn = document.getElementById('btn-run-macro-sim');
  const resultBox = document.getElementById('macro-sim-result-box');
  if (resultBox) resultBox.classList.add('hidden');

  if (btn) {
    btn.className = 'tap-active w-full py-3.5 rounded-2xl bg-brand-teal hover:bg-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5';
    btn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>ทดลองสถานการณ์นี้</span>
    `;
  }

  if (typeof showWatchlistToast === 'function') {
    showWatchlistToast('รีเซ็ตการทดสอบสถานการณ์แล้ว', false);
  }
}

// Global Exports
window.updateCardVisuals = updateCardVisuals;
window.recalcMacroScenarios = recalcMacroScenarios;
window.toggleDedicatedScenario = toggleDedicatedScenario;
window.setDedicatedScenario = setDedicatedScenario;
window.runMacroScenarioSimulation = runMacroScenarioSimulation;
window.resetMacroSimulationState = resetMacroSimulationState;

