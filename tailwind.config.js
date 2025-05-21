/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Zesty-inspired color palette
        zesty: {
          cream: '#f5f2e9',
          beige: '#e6dfd1',
          tan: '#d5c9b1',
          brown: '#42301e',
          coral: '#e8a87c',
          peach: '#f8c4a2',
          sage: '#a5b1a2',
          olive: '#7d8777',
        },
        primary: {
          50: '#f5f7ff',
          100: '#ecf0ff',
          200: '#d9e0ff',
          300: '#b6c5ff',
          400: '#8a9eff',
          500: '#6b7eff',
          600: '#4654ff',
          700: '#3240db',
          800: '#2a35b1',
          900: '#272f8a',
          950: '#1a1d52',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        accent: {
          300: '#ffbb85',
          400: '#ff9d5c',
          500: '#ff7a1f',
          600: '#e05e00',
        },
        error: {
          500: '#ef4444',
        },
        success: {
          500: '#22c55e',
        },
        background: '#f5f2e9',
        surface: '#ffffff',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Source Sans 3"', 'sans-serif'],
        // Adding Zesty-style fonts
        serif: ['"Cormorant Garamond"', 'Garamond', 'serif'],
        elegant: ['"Cormorant Garamond"', 'Garamond', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'pattern': "url('https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        'hero-pattern': "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        // Zesty-style gradients
        'zesty-gradient': 'linear-gradient(to bottom, #f5f2e9, #f5f2e9, #f8c4a2)',
        'zesty-overlay': 'linear-gradient(to right, rgba(66, 48, 30, 0.1), rgba(66, 48, 30, 0.05))',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-in forwards',
        slideUp: 'slideUp 1s ease-out forwards',
        slideRight: 'slideRight 1s ease-out forwards',
        bounce: 'bounce 1s infinite',
        scaleIn: 'scaleIn 0.8s ease-out forwards',
        // Zesty-specific animations
        'fade-in-slow': 'fadeIn 1.5s ease-in-out forwards',
        'slide-up-smooth': 'slideUpSmooth 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Zesty smooth animations
        slideUpSmooth: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      transitionDelay: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        // Zesty-specific easings
        'elegant': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};