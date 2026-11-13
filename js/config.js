/**
 * FINVEST Configuration & Tailwind Setup
 */

// Tailwind CSS Theme Extension
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: {
            navy: '#102A43',
            blue: '#176B87',
            teal: '#21A6A1',
            bg: '#F4F7FA',
            white: '#FFFFFF',
            green: '#16A36A',
            red: '#DC5656',
            surface: '#FFFFFF',
            border: '#E2E8F0',
            muted: '#627D98',
          }
        },
        fontFamily: {
          sans: ['Inter', 'IBM Plex Sans Thai', 'sans-serif'],
          thai: ['IBM Plex Sans Thai', 'sans-serif'],
          num: ['Inter', 'sans-serif'],
        }
      }
    }
  };
}

window.APP_CONFIG = {
  appName: 'FINVEST',
  version: '2.5.0',
  defaultMode: 'real',
  currency: '฿',
};

