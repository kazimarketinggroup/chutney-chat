/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // The markup uses xs: in ~28 places for small-phone tuning, but the
      // breakpoint was never defined — so every one of those classes compiled
      // to nothing. 475px is the usual value for this tier (iPhone SE is 375,
      // most modern phones 390-430).
      screens: {
        xs: '475px',
      },
      spacing: {
        // Values the markup already uses that are not on the default scale, so
        // they produced no CSS at all: w-22/h-22 on the speakers grid, and
        // sm:pb-18 on the speaker hero sections.
        18: '4.5rem',
        22: '5.5rem',
      },
      colors: {
        brand: {
          orange: '#EE6422',
          dark: '#1e1e1e',
          gray: '#2d2d2d',
          lightBg: '#FAFAFA',
          accent: '#F97316'
        }
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
