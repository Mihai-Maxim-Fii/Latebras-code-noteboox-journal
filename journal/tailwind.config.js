/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                "pgray": "#363333",
                "pblack": "#272121",
                "porange": "#E16428",
                "ppink": "#F6E9E9",
                "rblue":"#61DBFB"
            },
            width: {
                "w-192": "49rem"
            },
            screens: {
                "xss": "375px"
            }
        }
    },
    plugins: []
}
