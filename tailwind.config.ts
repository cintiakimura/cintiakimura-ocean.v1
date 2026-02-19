
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Dark mode is now default, but class can be kept for future toggles
  theme: {
    extend: {
      colors: {
        'vscode-bg-deep': 'hsl(var(--vscode-bg-deep))',
        'vscode-bg-light': 'hsl(var(--vscode-bg-light))',
        'vscode-sidebar': 'hsl(var(--vscode-sidebar))',
        'vscode-header': 'hsl(var(--vscode-header))',
        'vscode-border': 'hsl(var(--vscode-border))',
        'vscode-text': 'hsl(var(--vscode-text))',
      },
    },
  },
  plugins: [],
}
export default config
