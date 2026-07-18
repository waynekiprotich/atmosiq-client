const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.resolve(__dirname, '../src/assets');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Colors
const C_DARK = '#2563EB';
const C_MID = '#3B82F6';
const C_LIGHT = '#60A5FA';
const C_WHITE = '#FFFFFF';
const C_DARK_BG = '#1E293B';

// Geometric 'A' + Sun/Droplet mark
const logoMark = `
  <!-- Left stem -->
  <rect x="40" y="16" width="16" height="88" rx="8" transform="rotate(24 48 60)" fill="${C_DARK}"/>
  <!-- Crossbar Circle -->
  <circle cx="60" cy="72" r="18" fill="${C_MID}"/>
  <!-- Right stem -->
  <rect x="64" y="16" width="16" height="88" rx="8" transform="rotate(-24 72 60)" fill="${C_LIGHT}"/>
`;

const logoMarkMonochrome = `
  <rect x="40" y="16" width="16" height="88" rx="8" transform="rotate(24 48 60)" fill="currentColor"/>
  <circle cx="60" cy="72" r="18" fill="currentColor" opacity="0.8"/>
  <rect x="64" y="16" width="16" height="88" rx="8" transform="rotate(-24 72 60)" fill="currentColor" opacity="0.6"/>
`;

const logoIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
${logoMark}
</svg>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
${logoMark}
</svg>`;

const logoPrimarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="100%" height="100%">
  <g transform="translate(10, 0)">
    ${logoMark}
  </g>
  <text x="140" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="700" fill="#111827" letter-spacing="-1.5">Atmos<tspan fill="${C_DARK}">IQ</tspan></text>
</svg>`;

const logoHorizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="100%" height="100%">
  <g transform="translate(10, 0)">
    ${logoMark}
  </g>
  <text x="140" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="700" fill="#111827" letter-spacing="-1.5">Atmos<tspan fill="${C_DARK}">IQ</tspan></text>
</svg>`;

const logoMonochromeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="100%" height="100%" color="${C_DARK_BG}">
  <g transform="translate(10, 0)">
    ${logoMarkMonochrome}
  </g>
  <text x="140" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="700" fill="currentColor" letter-spacing="-1.5">AtmosIQ</text>
</svg>`;

async function generate() {
  // Write SVGs
  fs.writeFileSync(path.join(ASSETS_DIR, 'logo-icon.svg'), logoIconSvg);
  fs.writeFileSync(path.join(ASSETS_DIR, 'logo-primary.svg'), logoPrimarySvg);
  fs.writeFileSync(path.join(ASSETS_DIR, 'logo-horizontal.svg'), logoHorizontalSvg);
  fs.writeFileSync(path.join(ASSETS_DIR, 'logo-monochrome.svg'), logoMonochromeSvg);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), faviconSvg);

  // Generate PNGs for favicon & PWA
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  for (const s of sizes) {
    await sharp(Buffer.from(faviconSvg))
      .resize(s.size, s.size)
      .png()
      .toFile(path.join(PUBLIC_DIR, s.name));
    console.log("Generated " + s.name);
  }
  console.log('All branding assets redesigned and generated successfully.');
}

generate().catch(console.error);
