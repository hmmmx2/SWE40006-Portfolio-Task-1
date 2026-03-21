/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: '#f5f5f4',
        card: '#ffffff',
        ink: '#111827',
        muted: '#6b7280',
        faint: '#9ca3af',
        border: '#e5e7eb',
        hover: '#f9fafb',
        income: '#2d6a4f',
        'income-bg': '#f0faf4',
        expense: '#991b1b',
        'expense-bg': '#fef2f2',
        'active-nav': '#f0faf4',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
