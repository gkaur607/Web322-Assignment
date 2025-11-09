/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),],
  daisyui: {
    themes: ["dark"],
  },
}