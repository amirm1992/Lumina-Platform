import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                brand: ['var(--font-brand)', 'sans-serif'],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "fintech-gray": {
                    50: "#f9fafb",
                    100: "#f3f4f6",
                    200: "#e5e7eb",
                    300: "#d1d5db",
                    400: "#9ca3af",
                    500: "#6b7280",
                    600: "#4b5563",
                    700: "#374151",
                    800: "#1f2937",
                    900: "#111827",
                },
            },
            animation: {
                "gradient-x": "gradient-x 15s ease infinite",
                "float-slow": "float 6s ease-in-out infinite",
                "float-slower": "float 8s ease-in-out infinite",
            },
            keyframes: {
                "gradient-x": {
                    "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
                    "50%": { "background-size": "200% 200%", "background-position": "right center" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
