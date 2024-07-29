/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "tw-",
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat'],
        'lato': ['Lato'],
        'garamond': ['Garamond']
      },
      colors: {
        'greenBtn': '#008432',
        'redBtn': '#FE1700',
        'navBar': '#D9D9D9',
        'header': '#E7E6E8',
        'redColory': '#FE1700',
        'yellowColory': '#FCC623',
        'greenColory': '#119432',
        'blueColory': '#008DCC',
        'logoBorder': '#273b53',
      }
    },
    fontSize: {
      none: '0',
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    }
  },
  plugins: [],
}

