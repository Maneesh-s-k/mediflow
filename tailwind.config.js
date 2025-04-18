/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./frontend/**/*.{html,js}",
      "./frontend/*.html",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#e6f1fe',
            100: '#cce3fd',
            200: '#99c7fb',
            300: '#66aaf9',
            400: '#338ef7',
            500: '#0072f5',
            600: '#005bc4',
            700: '#004493',
            800: '#002e62',
            900: '#001731',
          },
          secondary: {
            500: '#2ecc71',
            600: '#27ae60',
          },
          warning: {
            500: '#f39c12',
            600: '#d35400',
          },
          danger: {
            500: '#e74c3c',
            600: '#c0392b',
          },
          dark: {
            800: '#1a1a2e',
            700: '#16213e',
            600: '#0f3460',
            500: '#1f4287',
          },
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  