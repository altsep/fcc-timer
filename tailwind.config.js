module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: [
        'children',
        'DEFAULT',
        'children-first',
        'children-last',
        'children-odd',
        'children-even',
        'children-not-first',
        'children-not-last',
        'children-hover',
        'hover',
        'children-focus',
        'focus',
        'children-focus-within',
        'focus-within',
        'children-active',
        'active',
        'children-visited',
        'visited',
        'children-disabled',
        'disabled',
        'responsive',
      ],
    },
  },
  plugins: [require('tailwindcss-textshadow'), require('tailwindcss-children')],
};
