/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  variants: {
    extend: {
      scale: ["active"],
      opacity: ["active"],   // add whichever props you need
    },
  },
  plugins: [],
}