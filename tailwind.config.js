/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                softBlue: "#eaf6fb"
            }
        },
        fontFamily: {
            lobster: ["Lobster", "cursive"],
            bebas: ['Bebas Neue', 'sans-serif'],
            montserrat: ['Montserrat', 'sans-serif'],
        },
    },
    plugins: [],
};