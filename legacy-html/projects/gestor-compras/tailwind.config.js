/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./store/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#0f172a',
                    secondary: '#3b82f6',
                    success: '#10b981',
                    accent: '#6366f1',
                    bg: '#f8fafc',
                    card: '#ffffff',
                    border: '#f1f5f9'
                }
            },
            borderRadius: {
                'brand-lg': '2.5rem',
                'brand-xl': '3.5rem'
            }
        },
    },
    plugins: [],
}
