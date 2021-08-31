const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        custom_blue: '#242f3f',
        custom_blue2: '#476072',
        custom_turquoise: '#548CA8',
        custom_gray: '#EEEEEE',
      },
    },
  },
  variants: {
    extend: {
      animation: ['group-hover'],
      rotate: ['hover', 'group-hover'],
      borderWidth: ['responsive'],
      transitionTimingFunction: ['group-hover'],
      transitionDelay: ['group-hover']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}