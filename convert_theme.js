import fs from 'fs';

const colors = {
  "on-surface-variant": "#45464d",
  "outline": "#76777d",
  "on-secondary-fixed-variant": "#0b513d",
  "secondary-fixed-dim": "#95d3ba",
  "error": "#ba1a1a",
  "error-container": "#ffdad6",
  "surface": "#fcf8fa",
  "tertiary": "#000000",
  "on-primary": "#ffffff",
  "on-surface": "#1b1b1d",
  "tertiary-fixed": "#fcdeb5",
  "outline-variant": "#c6c6cd",
  "on-error": "#ffffff",
  "on-error-container": "#93000a",
  "surface-bright": "#fcf8fa",
  "on-tertiary-fixed-variant": "#574425",
  "surface-container-high": "#eae7e9",
  "inverse-surface": "#303032",
  "surface-container-highest": "#e4e2e4",
  "tertiary-fixed-dim": "#dec29a",
  "on-tertiary-container": "#98805d",
  "on-primary-fixed": "#131b2e",
  "surface-container": "#f0edef",
  "on-secondary-container": "#306d58",
  "on-secondary": "#ffffff",
  "secondary-fixed": "#b0f0d6",
  "on-background": "#1b1b1d",
  "surface-dim": "#dcd9db",
  "primary-fixed": "#dae2fd",
  "on-secondary-fixed": "#002117",
  "on-tertiary": "#ffffff",
  "surface-variant": "#e4e2e4",
  "background": "#fcf8fa",
  "on-primary-fixed-variant": "#3f465c",
  "primary-container": "#131b2e",
  "secondary-container": "#adedd3",
  "on-primary-container": "#7c839b",
  "tertiary-container": "#271901",
  "inverse-primary": "#bec6e0",
  "primary-fixed-dim": "#bec6e0",
  "surface-tint": "#565e74",
  "primary": "#000000",
  "surface-container-low": "#f6f3f5",
  "surface-container-lowest": "#ffffff",
  "secondary": "#2b6954",
  "inverse-on-surface": "#f3f0f2",
  "on-tertiary-fixed": "#271901"
};

const borderRadius = {
  "DEFAULT": "0.125rem",
  "lg": "0.25rem",
  "xl": "0.5rem",
  "full": "0.75rem"
};

const spacing = {
  "margin-desktop": "48px",
  "gutter": "24px",
  "unit": "8px",
  "margin-mobile": "16px",
  "container-max": "1280px"
};

const fontFamily = {
  "display": "'Hanken Grotesk', sans-serif",
  "body-md": "'Inter', sans-serif",
  "label-md": "'Inter', sans-serif",
  "headline-sm": "'Hanken Grotesk', sans-serif",
  "headline-md": "'Hanken Grotesk', sans-serif",
  "headline-lg": "'Hanken Grotesk', sans-serif"
};

let css = `@import "tailwindcss";\n\n@theme {\n`;

for (const [k, v] of Object.entries(colors)) {
  css += `  --color-${k}: ${v};\n`;
}

for (const [k, v] of Object.entries(borderRadius)) {
  css += `  --radius-${k}: ${v};\n`;
}

for (const [k, v] of Object.entries(spacing)) {
  css += `  --spacing-${k}: ${v};\n`;
}

for (const [k, v] of Object.entries(fontFamily)) {
  css += `  --font-${k}: ${v};\n`;
}

css += `}\n`;

fs.writeFileSync('src/styles/global.css', css);
console.log('Done');
