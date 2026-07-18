const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Colors
const COLOR_START = '#2563EB'; // blue-600
const COLOR_END = '#60A5FA';   // blue-400

const svgDef = `
  <defs>
    <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLOR_START}" />
      <stop offset="100%" stop-color="${COLOR_END}" />
    </linearGradient>
    <linearGradient id="monochrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#374151" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
  </defs>
`;

const ICON_CONTENT = `
  <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#brand-grad)" />
  <circle cx="9" cy="8" r="3" fill="#fde047" />
  <path d="M15 10.5a3.5 3.5 0 0 0-6.42-1.92A4.5 4.5 0 0 0 5.5 17h9.5a3.5 3.5 0 0 0 0-7z" fill="#ffffff" />
`;

const ICON_CONTENT_MONO = `
  <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#monochrome-grad)" />
  <circle cx="9" cy="8" r="3" fill="#e5e7eb" />
  <path d="M15 10.5a3.5 3.5 0 0 0-6.42-1.92A4.5 4.5 0 0 0 5.5 17h9.5a3.5 3.5 0 0 0 0-7z" fill="#ffffff" />
`;

const primaryLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" width="120" height="32">
  ${svgDef}
  <g transform="translate(4, 4) scale(1.2)">
    ${ICON_CONTENT}
  </g>
  <text x="38" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="18" fill="#111827" letter-spacing="-0.5">AtmosIQ</text>
</svg>`;

const iconLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  ${svgDef}
  ${ICON_CONTENT}
</svg>`;

const horizontalLogoSvg = primaryLogoSvg;

const monochromeLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" width="120" height="32">
  ${svgDef}
  <g transform="translate(4, 4) scale(1.2)">
    ${ICON_CONTENT_MONO}
  </g>
  <text x="38" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="18" fill="#111827" letter-spacing="-0.5">AtmosIQ</text>
</svg>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  ${svgDef}
  ${ICON_CONTENT}
</svg>`;

async function main() {
  // Write SVGs
  fs.writeFileSync(path.join(ASSETS_DIR, 'logo-primary.svg'), primaryLogoSvg);
  fs.writeFileSync(path.join(ASSETS_DIR, 'logo-icon.svg'), iconLogoSvg);
  fs.writeFileSync(path.join(ASSETS_DIR, 'logo-horizontal.svg'), horizontalLogoSvg);
  fs.writeFileSync(path.join(ASSETS_DIR, 'logo-monochrome.svg'), monochromeLogoSvg);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), faviconSvg);

  console.log('SVGs created successfully.');

  // Create PNGs using sharp
  const buffer = Buffer.from(iconLogoSvg);

  const pngConfig = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  for (const cfg of pngConfig) {
    await sharp(buffer)
      .resize(cfg.size, cfg.size)
      .png()
      .toFile(path.join(PUBLIC_DIR, cfg.name));
    console.log('Created ' + cfg.name);
  }
}

main().catch(console.error);
