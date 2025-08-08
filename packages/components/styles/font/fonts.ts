import localFont from "next/font/local";

export const CUSTOM_FONT = localFont({
    src: [
        {
            path: "./Arial.woff",
        },
        {
            path: "./Arial.woff2",
        },
    ],
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
    variable: "--font-custom-font",
});
