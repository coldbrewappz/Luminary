/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linen: '#F0EAE0',
        'linen-dark': '#E4DDD2',
        lavender: '#DDD5F0',
        'lavender-deep': '#B8AEDE',
        blush: '#E8D5CB',
        'blush-deep': '#D4B9AC',
        sage: '#D9E7D2',
        'sage-deep': '#B8CDAE',
        'text-dark': '#2C2520',
        'text-mid': '#6B5D55',
        'text-light': '#74655B',
      },
    },
  },
  plugins: [],
}