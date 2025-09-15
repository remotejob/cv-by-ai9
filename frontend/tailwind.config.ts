import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        'accent': '#70FF00',
        'gray-5': '#E0E0E0',
        'card-bg': '#6A6969',
        'dark-bg': '#161616',
      },
      fontSize: {
        'heading-xl': ['50px', { lineHeight: '1.17', fontWeight: '700' }],
        'heading-lg': ['49px', { lineHeight: '1.17', fontWeight: '700' }],
        'heading-md': ['39px', { lineHeight: '1.17', fontWeight: '700' }],
        'heading-sm': ['26px', { lineHeight: '1.17', fontWeight: '700' }],
        'body': ['23px', { lineHeight: '1.17', fontWeight: '700' }],
      },
      borderRadius: {
        'card': '14px',
      },
      spacing: {
        'content': '95px',
        'skill-icon': '128px',
        'card-w': '473px',
        'card-h': '240px',
      },
      boxShadow: {
        'card': '0px 4px 10px 5px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 1) 0%, rgba(39, 39, 39, 1) 44%, rgba(73, 73, 73, 1) 100%, rgba(114, 114, 114, 1) 100%)',
      },
      borderWidth: {
        'accent': '5px',
      },
    },
  },
  plugins: [],
};
export default config;