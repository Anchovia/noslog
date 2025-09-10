import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",

                // 배경 보더
                dark: {
                    primary: "#0a0d13",
                    secondary: "#161b26",
                    tertiary: "#1e2330",
                },

                // 타이틀 및 하위 텍스트 기본 색상
                white: {
                    primary: "#FFFFFF",
                    secondary: "#CFCFCF",
                },

                // 난이도 색상
                normal: "#4ADE80", // Normal
                hard: "#FB923C", // Hard
                expert: "#F87171", // Expert
                real: "#A78BFA", // Real
            },
        },
    },
    plugins: [],
};
export default config;
