const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  theme: {
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
  plugins: [],
}

