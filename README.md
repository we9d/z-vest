# FINVEST - Mobile Investment App (Refactored)

แอปพลิเคชันจำลองและลงทุนจริงสำหรับสมาร์ทโฟน (FINVEST Mobile App) ได้รับการแยกหน้าโค้ดและ Refactor ตามหลักสถาปัตยกรรม **Clean Architecture & Best Practices** เพื่อความง่ายในการพัฒนาต่อยอด การบำรุงรักษา และการนำไปใช้ร่วมกับ Framework สมัยใหม่ (เช่น React, Vue, Next.js หรือ Mobile Web Views)

---

## 📁 โครงสร้างโปรเจกต์ใหม่ (Project Structure)

```text
stitch_remix_of_z_vest_mobile_investment_app/
├── index.html                 # Main App Entrypoint & Shell (จัดระเบียบโครงสร้างหลัก)
├── code.html                  # ซิงก์โค้ดเวอร์ชันคลีนให้ตรงกับ index.html
├── code.backup.html           # สำรองไฟล์เดิมขนาด 236KB ก่อนการรีแฟกเตอร์
├── README.md                  # เอกสารอธิบายสถาปัตยกรรมและการใช้งาน
│
├── css/
│   └── style.css              # รวม Custom CSS, Transitions, Fonts, Scrollbar utilities
│
├── js/
│   ├── config.js              # Tailwind Configuration & ค่าคงที่แอปพลิเคชัน
│   ├── store.js               # Centralized State Management (appState, watchlist, holdings)
│   ├── router.js              # Router & Navigation Controller (จัดการหน้าจอ, History, Tabs)
│   ├── app.js                 # Bootstrapper ควบคุมการเปิดแอปและ Lifecycle
│   │
│   ├── components/            # ตัวควบคุมส่วนประกอบ UI ที่ใช้ซ้ำ
│   │   ├── bottom-nav.js      # ตัวควบคุมแถบ Bottom Navigation
│   │   └── modals.js          # จัดการ Popup / Modal (Order, Success, Simulator, Toast)
│   │
│   └── screens/               # Screen Controllers แยกตามฟังก์ชันแต่ละหน้า
│       ├── home.js            # หน้าหลักและข้อมูลภาพรวม
│       ├── portfolio.js       # หน้าพอร์ตลงทุนจริงและสรุปผล
│       ├── navigator.js       # สำรวจสินทรัพย์ ค้นหา กรองหมวดหมู่ และ Watchlist
│       ├── asset-detail.js    # หน้าวิเคราะห์และส่งคำสั่งซื้อขาย (Unified Trading)
│       ├── simulator.js       # ระบบห้องทดลองลงทุนจำลอง (Paper Trading)
│       ├── ai-coach.js        # AI ผู้ช่วยวิเคราะห์พอร์ตการลงทุน
│       ├── macro.js           # Multi-Scenario Stress Test Engine (จำลองวิกฤตเศรษฐกิจ)
│       ├── profile.js         # หน้าตั้งค่าบัญชีและโปรไฟล์ผู้ใช้
│       └── auth.js            # หน้าเข้าสู่ระบบและสมัครสมาชิก
│
├── screens/                   # Template HTML แยกไฟล์รายหน้าจอ (12 หน้าจอ)
│   ├── screen-home.html               # หน้าแดชบอร์ดหลัก
│   ├── screen-real-portfolio.html     # หน้าพอร์ตลงทุนจริง
│   ├── screen-sim-summary.html        # หน้าสรุปพอร์ตจำลอง
│   ├── screen-real-summary.html       # หน้าสรุปผลการลงทุนจริง
│   ├── screen-navigator.html          # หน้าสำรวจสินทรัพย์
│   ├── screen-asset-detail.html       # หน้ารายละเอียดสินทรัพย์ / ซื้อขาย
│   ├── screen-simulator-setup.html    # หน้าตั้งค่าเงินทุนจำลอง
│   ├── screen-ai-coach.html           # หน้าแชท AI Coach
│   ├── screen-macro-scenario.html     # หน้าทดสอบสถานการณ์เศรษฐกิจ
│   ├── screen-profile.html            # หน้าโปรไฟล์และบัญชี
│   ├── screen-login.html              # หน้าเข้าสู่ระบบ
│   └── screen-register.html           # หน้าลงทะเบียนผู้ใช้ใหม่
│
└── components/                # Template HTML ส่วนประกอบส่วนกลาง
    ├── status-bar.html        # กรอบ Dynamic Island และ Status Bar (iPhone 16 Pro Max)
    ├── bottom-nav.html        # เมนูนำทางด้านล่าง (Floating Bottom Nav)
    ├── modals.html            # รวมหน้าต่าง Modal (Order, Simulator, Result)
    └── toast.html             # Watchlist Toast Notification
```

---

## 🛠️ จุดที่ได้รับการ Refactor ตาม Best Practices

### 1. แยก Concerns อย่างชัดเจน (Separation of Concerns)
* **เดิม:** โค้ดทั้งหมด ทั้ง HTML 12 หน้าจอ, CSS, JavaScript 14 ชุด และ Modals ถูกนำมากองรวมกันในไฟล์เดียวขนาด 236 KB โดยหลายบรรทัดถูกย่อติดกันยาวหลายหมื่นตัวอักษร
* **ใหม่:** แยกไฟล์ CSS ไปไว้ใน `css/style.css`, แยก JavaScript เป็นโมดูลใน `js/` ตามหน้าที่, และแยกหน้าจอเป็นไฟล์เดี่ยวในโฟลเดอร์ `screens/` ทำให้สะดวกในการเปิดดูและแก้ไขเฉพาะส่วน

### 2. แก้ไขปัญหา Monkey Patching & Anti-patterns
* **เดิม:** มีการเขียนทับ `window.navTo`, `window.openAssetDetail`, `window.openSimSection` ซ้ำซ้อนกันหลายรอบในหลาย script tag
* **ใหม่:** รวมศูนย์ไว้ที่ `js/router.js` จัดการ State และ History Stack อย่างถูกต้อง รองรับการเปิด-ปิด Bottom Navigation แบบไดนามิกโดยอัตโนมัติ

### 3. ย้าย Modals ขึ้นมาเป็น Global Overlay Layer
* **เดิม:** Modals ทั้งหมด (เช่น `modal-order`, `modal-sim-trading`, `modal-success`) ถูกยัดไว้ใต้แท็ก `<section id="screen-asset-detail">` ทำให้มีปัญหาเรื่อง Display และ DOM hierarchy
* **ใหม่:** แยก Modals ออกมาเป็น Global Component Layer ใน `components/modals.html` และควบคุมผ่าน `js/components/modals.js` ทำให้เรียกใช้ได้จากทุกหน้าจอ

### 4. รวมศูนย์ State Management (Single Source of Truth)
* สร้าง `js/store.js` เก็บสถานะกลางของแอปพลิเคชัน:
  - `appState`: โหมดลงทุน ('real' | 'sim'), สินทรัพย์ที่กำลังดู, เงินสดคงเหลือ
  - `userWatchlist`: รายการหุ้นที่กดดาวติด Favorite (`Set(['SPY', 'AAPL'])`)
  - `heldAssetsData`: ข้อมูลสินทรัพย์ที่มีในพอร์ตจริง
  - `simTradeState`: ข้อมูลการซื้อขายจำลอง
  - `macroScenarioConfig`: ข้อมูลการคำนวณผลกระทบเศรษฐกิจมหภาค

### 5. รองรับทั้งการเปิดตรง (Direct File) และ Web Server
* ไฟล์ `index.html` และ `code.html` ได้รับการจัดเรียง Indentation และ Syntax อย่างประณีต สามารถดับเบิลคลิกเปิดบนเบราว์เซอร์ได้ทันทีโดยไม่ติดปัญหา CORS ของ Browser

---

## 🚀 วิธีการทดสอบและเปิดใช้งาน (How to Run)

1. **เปิดตรงผ่าน Browser:**
   - ดับเบิลคลิกเปิดไฟล์ `index.html` หรือ `code.html` ได้ทันที

2. **เปิดผ่าน Local Development Server (ทางเลือก):**
   ```bash
   # ใช้ npx serve
   npx serve .

   # หรือใช้ Python
   python -m http.server 8000
   ```

