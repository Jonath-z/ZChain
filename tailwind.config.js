module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        Orbitron: ['Orbitron', 'sans-serif'],
        Roboto: ['Roboto', 'sans-serif'],
        Mulish: ['Mulish', 'sans-serif']
      },
      screens: {
        xsm: { min: '300px', max: '399px' },
        sm: { min: '400px', max: '768px' },
        // md: { min: '768px', max: '1023px' },
        lg: { min: '1024px', max: '1279px' },
        // xl: { min: '1280px', max: '1535px' },
        '2xl': { min: '1278px' },
      },
    },
  },
  plugins: [],
}
