/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ['Noto Serif Display', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
