/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./demo/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aletheia: {
          primary: '#3b82f6',
          'primary-dark': '#2563eb',
          secondary: '#8b5cf6',
          'secondary-dark': '#7c3aed',
          success: '#10b981',
          'success-dark': '#059669',
          warning: '#f59e0b',
          'warning-dark': '#d97706',
          error: '#ef4444',
          'error-dark': '#dc2626',
          neutral: '#6b7280',
          'neutral-dark': '#4b5563',
        },
      },
    },
  },
  plugins: [],
}
