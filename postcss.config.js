module.exports = {
  plugins: {
    'tailwindcss/nesting': 'postcss-nesting', // Add this BEFORE tailwind
    tailwindcss: {},
    autoprefixer: {},
  },
}