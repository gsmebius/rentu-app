/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#1A73E8',
        secondary: '#FF6F61',
        background: '#F5F5F5',
        success: '#28A745',
        error: '#DC3545',
      },
      fontFamily: {
        body: ['Poppins'],
        head: ['CalSans'],
      },
    },
  },
  plugins: [],
};
