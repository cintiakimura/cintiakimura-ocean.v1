
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bkg: 'hsl(var(--bkg))',
        content: 'hsl(var(--content))',
        primary: 'hsl(var(--primary))',
        'primary-content': 'hsl(var(--primary-content))',
        muted: 'hsl(var(--muted))',
      },
    },
  },
  plugins: [],
}
export default config
