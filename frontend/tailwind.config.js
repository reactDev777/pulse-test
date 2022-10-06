/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                secondary: '#535661',
                yellow: '#F3C843',
                green: '#72BF65',
                red: '#D83232',
            },
            fontFamily: {
                primary: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
