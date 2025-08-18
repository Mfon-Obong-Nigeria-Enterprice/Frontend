/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--cl-primary)',
        secondary: 'var(--cl-secondary)',
        'accent-orange': 'var(--cl-accent-orange)',
        'accent-red': 'var(--cl-accent-red)',
        'bg-light': 'var(--cl-bg-light)',
        'bg-gray': 'var(--cl-bg-gray)',
        'bg-green': 'var(--cl-bg-green)',
        'bg-light-green': 'var(--cl-bg-light-green)',
        'bg-pink': 'var(--cl-bg-pink)',
        'text-dark': 'var(--cl-text-dark)',
        'text-semidark': 'var(--cl-text-semidark)',
        'text-gray': 'var(--cl-text-gray)',
        'error': 'var(--cl-error)',
        'success': 'var(--cl-success)',
        'border-gray': 'var(--cl-border-gray)',
        'blue': 'var(--cl-blue)',
        'light-gray': 'var(--cl-light-gray)',
        'gray-a1': 'var(--cl-gray-a1)',
      },
      backgroundColor: {
        theme: 'var(--color-background)',
        light: 'var(--color-light)',
      },
      textColor: {
        theme: 'var(--color-foreground)',
        dark: 'var(--color-text-dark)',
      },
    
    },
  },
  plugins: [],
}