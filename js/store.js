/**
 * FINVEST Centralized State Store
 * Manages application state, holdings, watchlist, and simulation parameters.
 */

// Core Application State
window.appState = {
  mode: 'real', // 'real' or 'sim'
  selectedAsset: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    price: '฿19,550.00',
    priceNum: 19550,
    change: '+0.75%',
    risk: 'ปานกลาง (ระดับ 3)',
    category: 'US ETF'
  },
  orderType: 'BUY',
  simStartingCash: 50000,
  simRemainingCash: 14320,
  realCash: 145250,
  previousScreen: 'screen-home',
  assetOrigin: null,
  cameFromHome: false
};

// User Watchlist Store (Symbols)
window.userWatchlist = new Set(['SPY', 'AAPL']);

// Real Portfolio Holdings Data
window.heldAssetsData = {
  'SPY': {
    name: 'SPDR S&P 500 ETF Trust',
    price: '฿19,550.00',
    priceNum: 19550,
    change: '+0.75%',
    risk: 'ปานกลาง (ระดับ 3)',
    cat: 'US ETF',
    heldQty: 12
  },
  'AAPL': {
    name: 'Apple Inc.',
    price: '฿8,120.00',
    priceNum: 8120,
    change: '+1.15%',
    risk: 'ปานกลาง (ระดับ 3)',
    cat: 'US Stock',
    heldQty: 15
  },
  'PTT': {
    name: 'PTT Public Co., Ltd.',
    price: '฿33.25',
    priceNum: 33.25,
    change: '-0.75%',
    risk: 'ปานกลาง (ระดับ 3)',
    cat: 'Thai Stock',
    heldQty: 2400
  }
};

// Simulator Trading State
window.simTradeState = {
  activeAsset: {
    sym: 'NVDA',
    name: 'Nvidia Corp',
    price: 4650,
    change: '+4.82%',
    cat: 'us',
    tag: 'US Stock',
    code: 'NASDAQ: NVDA',
    range: '฿4,800 / ฿2,100',
    pe: '42.8x',
    vol: '42.5M'
  },
  tradeType: 'BUY',
  virtualCash: 14000,
  virtualTotal: 54320
};

// Global Master Asset Catalog
window.assetCatalog = {
  'SPY': {
    name: 'SPDR S&P 500 ETF Trust',
    price: '฿19,550.00',
    priceNum: 19550,
    change: '+0.75%',
    risk: 'ปานกลาง (ระดับ 3)',
    cat: 'etf',
    tag: 'US ETF',
    code: 'US ETF: SPY',
    range: '฿20,100 / ฿16,800',
    pe: '24.5x',
    vol: '68.2M',
    heldQty: 12
  },
  'AAPL': {
    name: 'Apple Inc.',
    price: '฿8,120.00',
    priceNum: 8120,
    change: '+1.15%',
    risk: 'ปานกลาง (ระดับ 3)',
    cat: 'us',
    tag: 'US Stock',
    code: 'NASDAQ: AAPL',
    range: '฿8,400 / ฿6,200',
    pe: '31.2x',
    vol: '35.1M',
    heldQty: 15
  },
  'PTT': {
    name: 'PTT Public Co., Ltd.',
    price: '฿33.25',
    priceNum: 33.25,
    change: '-0.75%',
    risk: 'ปานกลาง (ระดับ 3)',
    cat: 'thai',
    tag: 'Thai Stock',
    code: 'SET: PTT',
    range: '฿36.00 / ฿31.00',
    pe: '9.4x',
    vol: '18.4M',
    heldQty: 2400
  },
  'NVDA': {
    name: 'Nvidia Corp',
    price: '฿4,650.00',
    priceNum: 4650,
    change: '+4.82%',
    cat: 'us',
    tag: 'US Stock',
    code: 'NASDAQ: NVDA',
    range: '฿4,800 / ฿2,100',
    pe: '42.8x',
    vol: '42.5M',
    heldQty: 0
  },
  'K-USA': {
    name: 'K USA Equity Fund',
    price: '฿14.32',
    priceNum: 14.32,
    change: '+1.80%',
    risk: 'สูง (ระดับ 4)',
    cat: 'fund',
    tag: 'Mutual Fund',
    code: 'FUND: K-USA',
    range: '฿15.20 / ฿12.10',
    pe: 'N/A',
    vol: '12.4M',
    heldQty: 5000
  },
  'CPALL': {
    name: 'CP ALL Public Co., Ltd.',
    price: '฿54.50',
    priceNum: 54.50,
    change: '+0.46%',
    risk: 'ปานกลาง (ระดับ 3)',
    cat: 'thai',
    tag: 'Thai Stock',
    code: 'SET: CPALL',
    range: '฿60.00 / ฿51.00',
    pe: '28.1x',
    vol: '15.6M',
    heldQty: 800
  }
};

// Macro Simulation Scenarios Data
window.selectedMacroScenarios = new Set(['rate_hike']);
window.BASE_MACRO_PORTFOLIO = 54320.00;

window.macroScenarioConfig = {
  currentKey: 'rate_hike',
  data: {
    'inflation': {
      name: 'เงินเฟ้อสูงขึ้น',
      title: 'สถานการณ์: เงินเฟ้อสูงขึ้น',
      badge: 'ภาวะเงินเฟ้อสูงเกินกรอบเป้าหมาย',
      impactPct: -5.8,
      impactDiff: -3150.56,
      afterVal: 51169.44,
      usImpact: -7.2,
      thImpact: -4.0,
      fundImpact: -5.1,
      cashImpact: 0.0,
      desc: 'อัตราเงินเฟ้อที่พุ่งสูงกดดันต้นทุนสินค้าและบริการ กระทบกำไรบริษัทจดทะเบียน แต่วัตถุดิบและสินค้าโภคภัณฑ์ช่วยพยุงได้บางส่วน',
      recovery: '~ 2.8 เดือน',
      recoveryMonths: 2.8,
      recoveryProb: '88%',
      advice: 'แนะนำสลับสินทรัพย์บางส่วนเข้าสู่ ETF สินค้าโภคภัณฑ์หรือหุ้นที่มี Pricing Power สูงเพื่อต้านทานเงินเฟ้อ'
    },
    'rate_hike': {
      name: 'ดอกเบี้ยปรับขึ้น',
      title: 'สถานการณ์: ดอกเบี้ยปรับขึ้น',
      badge: 'ธนาคารกลางปรับขึ้นดอกเบี้ยนโยบายเพื่อสกัดเงินเฟ้อ',
      impactPct: -6.5,
      impactDiff: -3530.80,
      afterVal: 50789.20,
      usImpact: -8.8,
      thImpact: -4.2,
      fundImpact: -5.5,
      cashImpact: 0.0,
      desc: 'อัตราดอกเบี้ยที่เพิ่มขึ้นส่งผลให้ต้นทุนทางการเงินของบริษัทสูงขึ้น กระทบต่อหุ้นเทคโนโลยีที่มีอัตราส่วน P/E สูงและตราสารหนี้เดิม แต่มูลค่าเงินสดจำลองยังคงช่วยพยุงเสถียรภาพโดยรวมของพอร์ต',
      recovery: '~ 3.5 เดือน',
      recoveryMonths: 3.5,
      recoveryProb: '82%',
      advice: 'เพิ่มสัดส่วนเงินสดหรือตราสารหนี้ระยะสั้น 10-15% จะช่วยลดอัตราการขาดทุนสูงสุด (Max Drawdown) ได้ถึง 38% ในสถานการณ์นี้'
    },
    'recession': {
      name: 'เศรษฐกิจถดถอย',
      title: 'สถานการณ์: เศรษฐกิจถดถอย',
      badge: 'การเติบโตทางเศรษฐกิจชะลอตัวลงต่อเนื่อง 2 ไตรมาส',
      impactPct: -9.4,
      impactDiff: -5106.08,
      afterVal: 49213.92,
      usImpact: -11.5,
      thImpact: -8.0,
      fundImpact: -4.2,
      cashImpact: 0.0,
      desc: 'ยอดขายและผลประกอบการรวมของภาคธุรกิจชะลอตัว หุ้นกลุ่มวัฏจักรและเติบโตปรับฐานลง สินทรัพย์ปลอดภัยและหุ้นกลุ่มการแพทย์ช่วยลดความผันผวน',
      recovery: '~ 5.2 เดือน',
      recoveryMonths: 5.2,
      recoveryProb: '76%',
      advice: 'พิจารณาเพิ่มน้ำหนักหุ้นกลุ่ม Defensive เช่น สินค้าอุปโภคบริโภคจำเป็น (Consumer Staples) และกองทุนโครงสร้างพื้นฐาน'
    },
    'market_crash': {
      name: 'ตลาดหุ้นปรับตัวลง',
      title: 'สถานการณ์: ตลาดหุ้นปรับตัวลง',
      badge: 'ความตื่นตระหนกในตลาด ดัชนีหลักปรับฐานลงรวดเร็ว',
      impactPct: -12.2,
      impactDiff: -6627.04,
      afterVal: 47692.96,
      usImpact: -15.4,
      thImpact: -11.8,
      fundImpact: -6.2,
      cashImpact: 0.0,
      desc: 'การเทขายสินทรัพย์เสี่ยงทั่วโลกทำให้ความผันผวนพุ่งสูง สินทรัพย์เกือบทุกกลุ่มถูกเทขายยกเว้นเงินสดและพันธบัตรระยะสั้น',
      recovery: '~ 6.8 เดือน',
      recoveryMonths: 6.8,
      recoveryProb: '64%',
      advice: 'เตรียมสำรองเงินสดเพื่อรอจังหวะซื้อสินทรัพย์คุณภาพดีที่มีส่วนลด (Buy on Dip) เมื่อดัชนีเริ่มสร้างฐาน'
    }
  }
};

