/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
         gray:{
          100:"eeeeef",
          200:"e6e9ed",
          600:"#95989c",
          900:"#b3b3b3"
         },
        purple:{
          200:"#d9ddee",
          500:"#9492db",
          600:"#7164c0"
        },
        orange:{
          200:'#f9f0e3'
        },
        pink:{
          200:'#fbe2f3'
        }
      }
    },
  },
  plugins: [],
}

