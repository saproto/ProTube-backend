const colors = require('tailwindcss/colors')

module.exports = {
  
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',

     '3': '3px',
      '4': '4px',

     '6': '6px',

     '8': '8px',
    },
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
        custom_blue: '#242f3f',
        custom_blue2: '#476072',
        custom_turquoise: '#548CA8',
        custom_gray: '#EEEEEE',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

