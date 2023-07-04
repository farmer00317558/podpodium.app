module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './component/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: '0 0 3px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 0 6px -1px rgba(0, 0, 0, 0.1), 0 0 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
    },
  },
  plugins: [],
};
