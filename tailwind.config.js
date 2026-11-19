/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        iosDark: '#121212',
        iosCard: '#2C2C2E',
        iosText: '#FFFFFF',
        iosTextMuted: '#8E8E93',
        iosAccentActive: '#30D158',
        iosAccentPaused: '#FF9F0A'
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled']
    }
  }
}