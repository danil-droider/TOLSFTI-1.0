// Vitest + jsdom setup for Goal Ticker PWA tests
import '@testing-library/jest-dom'

// Mock matchMedia for jsdom (Tailwind/Responsive CSS)
// @testing-library/user-event v14 exports matchMedia from the main package
global.matchMedia = global.matchMedia || ((query: string) => {
  const meta = document.querySelector('meta[name=viewport]')!
  return { matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn() }
})

// Mock formatNumber from calculator to prevent RN/JSX rendering errors
// This ensures formatNumber is available wherever App and its subcomponents render
global.formatNumber = global.formatNumber ||
  ((value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }))

// Mock canvas-confetti to avoid canvas requirement in jsdom
const mockConfetti = () => {}
;(global as any).canvasConfetti = mockConfetti

// Polyfill crypto.randomUUID for jsdom if needed
if (typeof crypto === 'undefined') {
  ;(global as any).crypto = {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  }
}