/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
      extend: {
          "colors": {
              "secondary": "#c9bfff",
              "inverse-on-surface": "#313030",
              "primary": "#c3f5ff",
              "background": "#131313",
              "on-tertiary-fixed": "#002111",
              "on-surface-variant": "#bac9cc",
              "primary-container": "#00e5ff",
              "primary-fixed": "#9cf0ff",
              "surface-container-low": "#1c1b1b",
              "on-error-container": "#ffdad6",
              "on-background": "#e5e2e1",
              "on-secondary-fixed-variant": "#441cc8",
              "tertiary-container": "#00ee98",
              "tertiary": "#abffcb",
              "on-secondary": "#2e009c",
              "surface-container": "#201f1f",
              "surface-variant": "#353534",
              "on-primary-fixed": "#001f24",
              "inverse-primary": "#006875",
              "on-secondary-container": "#baaeff",
              "tertiary-fixed": "#52ffac",
              "surface-container-high": "#2a2a2a",
              "surface-container-lowest": "#0e0e0e",
              "error": "#ffb4ab",
              "surface-dim": "#131313",
              "on-secondary-fixed": "#1a0063",
              "on-primary-container": "#00626e",
              "on-primary": "#00363d",
              "error-container": "#93000a",
              "outline": "#849396",
              "secondary-fixed-dim": "#c9bfff",
              "inverse-surface": "#e5e2e1",
              "on-tertiary-container": "#00673f",
              "tertiary-fixed-dim": "#00e290",
              "secondary-container": "#4720ca",
              "on-error": "#690005",
              "surface-tint": "#00daf3",
              "surface-container-highest": "#353534",
              "secondary-fixed": "#e5deff",
              "surface-bright": "#3a3939",
              "primary-fixed-dim": "#00daf3",
              "on-surface": "#e5e2e1",
              "on-tertiary": "#003920",
              "outline-variant": "#3b494c",
              "on-primary-fixed-variant": "#004f58",
              "surface": "#131313",
              "on-tertiary-fixed-variant": "#005231"
          },
          "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
          },
          "spacing": {
              "xs": "4px",
              "gutter": "24px",
              "base": "8px",
              "xl": "80px",
              "lg": "48px",
              "margin": "32px",
              "md": "24px",
              "sm": "12px"
          },
          "fontFamily": {
              "headline-lg": ["Geist", "sans-serif"],
              "label-sm": ["JetBrains Mono", "monospace"],
              "display-lg": ["Geist", "sans-serif"],
              "label-md": ["JetBrains Mono", "monospace"],
              "headline-md": ["Geist", "sans-serif"],
              "headline-lg-mobile": ["Geist", "sans-serif"],
              "body-lg": ["Inter", "sans-serif"],
              "body-md": ["Inter", "sans-serif"],
              "headline-sm": ["Geist", "sans-serif"],
              "headline-xs": ["Geist", "sans-serif"],
              "body-sm": ["Inter", "sans-serif"],
              "body-xs": ["Inter", "sans-serif"],
              "label-xs": ["JetBrains Mono", "monospace"]
          },
          "fontSize": {
              "headline-sm": ["20px", { "lineHeight": "1.3", "fontWeight": "500" }],
              "headline-xs": ["16px", { "lineHeight": "1.3", "fontWeight": "500" }],
              "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
              "body-xs": ["12px", { "lineHeight": "1.4", "fontWeight": "400" }],
              "label-xs": ["10px", { "lineHeight": "1.2", "fontWeight": "500" }],
              "headline-lg": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.03em", "fontWeight": "600" }],
              "label-sm": ["12px", { "lineHeight": "1.2", "fontWeight": "500" }],
              "display-lg": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700" }],
              "label-md": ["14px", { "lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "500" }],
              "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "500" }],
              "headline-lg-mobile": ["24px", { "lineHeight": "1.2", "fontWeight": "600" }],
              "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
              "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }]
          },
          "animation": {
              "scroll-up": "scrollUp 20s linear infinite",
              "float-slow": "float-slow 8s ease-in-out infinite",
              "float-fast": "float-fast 5s ease-in-out infinite",
              "scanline": "scanline 3s linear infinite",
              "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              "pulse-error": "pulse-red 2s infinite"
          },
          "keyframes": {
              "scrollUp": {
                  "0%": { transform: "translateY(10%)", opacity: 0 },
                  "10%": { opacity: 1 },
                  "90%": { opacity: 1 },
                  "100%": { transform: "translateY(-100%)", opacity: 0 }
              },
              "float-slow": {
                  "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
                  "50%": { transform: "translateY(-20px) rotate(1deg)" }
              },
              "float-fast": {
                  "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
                  "50%": { transform: "translateY(-10px) rotate(-1deg)" }
              },
              "scanline": {
                  "0%": { transform: "translateY(-100%)" },
                  "100%": { transform: "translateY(400%)" }
              },
              "pulseGlow": {
                  "0%, 100%": { opacity: 1, filter: "brightness(1)" },
                  "50%": { opacity: 0.7, filter: "brightness(1.5)" }
              },
              "pulse-red": {
                  "0%": { boxShadow: "0 0 0 0 rgba(255, 180, 171, 0.4)" },
                  "70%": { boxShadow: "0 0 0 10px rgba(255, 180, 171, 0)" },
                  "100%": { boxShadow: "0 0 0 0 rgba(255, 180, 171, 0)" }
              }
          }
      }
  },
  plugins: [],
}
