
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'coral': {
            500: '#FF6B47',
            600: '#FF5722'
          }
        }
      },
    },
    plugins: [],
  }
