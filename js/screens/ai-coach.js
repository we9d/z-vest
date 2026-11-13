/**
 * FINVEST AI Coach Screen Controller
 */

function sendAiPrompt(promptText) {
  const chatContainer = document.getElementById('ai-chat-messages');
  if (!chatContainer) return;

  // Append user bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'flex items-end justify-end space-x-2';
  userDiv.innerHTML = `
    <div class="p-3.5 rounded-2xl rounded-br-sm bg-brand-navy text-white text-xs max-w-[80%] shadow-xs">
      <p>${promptText}</p>
    </div>
  `;
  chatContainer.appendChild(userDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Simulate typing & AI response
  setTimeout(() => {
    const aiDiv = document.createElement('div');
    aiDiv.className = 'flex items-start space-x-2.5';
    aiDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">AI</div>
      <div class="p-3.5 rounded-2xl rounded-tl-sm bg-white border border-slate-200/80 text-xs text-slate-800 max-w-[85%] shadow-xs space-y-1">
        <p class="font-bold text-brand-navy">คำแนะนำวิเคราะห์:</p>
        <p>จากพอร์ตของคุณ ปัจจุบันมีสัดส่วนหุ้นเทคโนโลยีสหรัฐฯ สูงถึง 48% ซึ่งได้รับผลบวกจากกำไรกลุ่ม AI แต่หากมีความกังวลต่อความผันผวนของอัตราดอกเบี้ย แนะนำเพิ่มสัดส่วน ETF ตราสารหนี้ระยะสั้นหรือทองคำ 10% เพื่อรักษาสมดุลความเสี่ยง</p>
      </div>
    `;
    chatContainer.appendChild(aiDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 700);
}

window.sendAiPrompt = sendAiPrompt;

