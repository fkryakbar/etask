import type { Config } from 'tailwindcss'
const { nextui } = require("@nextui-org/react");
const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

  },
  daisyui: {
    themes: ['light', 'dark']
  },
  plugins: [require('@tailwindcss/typography'), nextui()],
}
export default config
