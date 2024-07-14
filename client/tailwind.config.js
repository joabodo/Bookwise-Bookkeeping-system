/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        purple: "hsl(246, 99%, 65%)",
        lime: "hsl(67, 96%, 48%)",
        "oxford-blue": "hsl(246, 100%, 4%)",
        "white-100": "hsl(0, 0%, 100%)",
        "white-200": "hsl(246, 99%, 98%)",
        "grey-100": "hsl(0, 0%, 94%)",
        "grey-200": "hsl(0, 0%, 70%)",
        "grey-100": "hsl(0, 0%, 40%)",
        "black-100": "hsl(0, 0%, 0%)",
        "error-red": "hsl(4, 90%, 58%)",
        "success-green": "hsl(133, 90%, 58%)",
      },
    },
    screens: {
      xl: { max: "1280px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1024px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "768px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "640px" },
      // => @media (max-width: 639px) { ... }

      xsm: { max: "320px" },
      // => @media (max-width: 319px) { ... }
    },
  },
  plugins: [],
};
