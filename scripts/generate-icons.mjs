import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = resolve(__dirname, '../public/icons');

const sizes = [192, 512];

for (const size of sizes) {
  const svgPath = resolve(iconsDir, `icon-${size}.svg`);
  const pngPath = resolve(iconsDir, `icon-${size}.png`);
  const svgBuffer = readFileSync(svgPath);

  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(pngPath);

  console.log(`✓ Generated ${pngPath}`);
}
