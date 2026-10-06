import type { Config } from "tailwindcss";

/**
 * Every value maps to a CSS custom property declared in globals.css :root,
 * which is extracted verbatim from the design source (petsitting-master.zip).
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.mdx",
  ],
  theme: {
    extend: {
      /* RGB-channel triplets (same values as the hex tokens in globals.css
         :root) so Tailwind opacity modifiers like bg-pine/10 work. */
      colors: {
        pine: "rgb(0 189 86 / <alpha-value>)",            /* #00bd56 */
        "pine-deep": "rgb(0 163 72 / <alpha-value>)",     /* #00a348 */
        azure: "rgb(32 125 255 / <alpha-value>)",         /* #207dff */
        navy: "rgb(0 4 60 / <alpha-value>)",              /* #00043c */
        body: "rgb(128 128 128 / <alpha-value>)",         /* #808080 */
        heading: "rgb(51 51 51 / <alpha-value>)",         /* rgba(0,0,0,.8) on white */
        mist: "rgb(250 250 250 / <alpha-value>)",         /* #fafafa */
        fog: "rgb(240 240 240 / <alpha-value>)",          /* #f0f0f0 */
        line: "rgb(230 230 230 / <alpha-value>)",         /* #e6e6e6 */
        emergency: "rgb(214 69 69 / <alpha-value>)",      /* #d64545 */
        "emergency-deep": "rgb(191 53 53 / <alpha-value>)", /* #bf3535 */
        wa: "rgb(37 211 102 / <alpha-value>)",            /* #25d366 */
        footer: "rgb(26 26 26 / <alpha-value>)",          /* #1a1a1a */
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      backgroundImage: {
        brand: "var(--grad)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        nav: "var(--shadow-nav)",
        lift: "var(--shadow-lift)",
        loader: "var(--shadow-loader)",
      },
      borderRadius: {
        brand: "var(--radius)",
      },
      transitionTimingFunction: {
        brand: "ease",
        wordy: "cubic-bezier(0.42, 0, 0.58, 1)",
      },
      maxWidth: {
        shell: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
