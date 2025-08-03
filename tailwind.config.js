/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#14006E',
        light: '#FFFFFF',
        primlight: '#0090E0',
        secundary: '#303057',
        edges: '#0A0029',
        bodytxt: '#121010',
        tag: '#DADADA',
        success: '#005252',
        error: '#850000',
      },
      fontFamily: {
        body: ['Poppins'],
        head: ['CalSans'],
      },
    },
  },
  plugins: [],
};
