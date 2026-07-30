/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    bg: '#F8F9FA',
                    accent: '#2563EB',
                    text: '#111827',
                },
                secondary: {
                    bg: '#FFFFFF',
                    accent: '#0EA5E9',
                    text: '#6B7280',
                },
                sidebar: '#1E293B',
                success: '#22C55E',
                warning: '#F59E0B',
                error: '#EF4444',
                border: '#E5E7EB',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
