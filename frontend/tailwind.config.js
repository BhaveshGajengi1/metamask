/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                secondary: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                },
                accent: {
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
            },
            animation: {
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'slide-out-right': 'slide-out-right 0.3s ease-in',
                'fade-in': 'fade-in 0.5s ease-out',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'gradient': 'gradient-shift 3s ease infinite',
                'count-up': 'count-up 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
                'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
                'glow-success': '0 0 20px rgba(16, 185, 129, 0.5)',
                'glow-warning': '0 0 20px rgba(245, 158, 11, 0.5)',
                'glow-error': '0 0 20px rgba(239, 68, 68, 0.5)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
        },
    },
    plugins: [],
}
