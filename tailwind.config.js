module.exports = {
  purge: ['./src/**/*.tsx', './src/**/*.js'],
  content: ['./app/**/*.tsx'],
  theme: {
    fontFamily: {
      body: ['Helvetica', 'Noto Sans JP'],
    },
    extend: {
      colors: {
        black: '#1c1a1a',
      },
      width: {
        '70v': '70vw'
      },
      minHeight: {
        '300': '300px'
      },
    }
  },
  variants: {},
  plugins: [],
};
