import fs from 'fs';
import zlib from 'zlib';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function crc32(data) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    crc = crc ^ byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createIHDR(width, height) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type (RGB)
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method
  return ihdr;
}

function createIDAT(width, height, r, g, b) {
  // Create raw image data: each row has filter byte + RGB pixels
  const rawData = Buffer.alloc((width * 3 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter type: None
    for (let x = 0; x < width; x++) {
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
    }
  }

  // Compress with zlib
  const compressed = zlib.deflateSync(rawData);
  return compressed;
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function generatePNG(width, height, r, g, b) {
  const ihdrData = createIHDR(width, height);
  const idatData = createIDAT(width, height, r, g, b);

  const chunks = Buffer.concat([
    PNG_SIGNATURE,
    createChunk('IHDR', ihdrData),
    createChunk('IDAT', idatData),
    createChunk('IEND', Buffer.alloc(0))
  ]);

  return chunks;
}

// Ensure public/images directory exists
const imageDir = 'public/images';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Generate the three images
const images = [
  { path: 'public/images/og-dev.png', width: 1200, height: 630, r: 255, g: 255, b: 255 },
  { path: 'public/images/og-dance.png', width: 1200, height: 630, r: 11, g: 11, b: 15 },
  { path: 'public/images/headshot.png', width: 600, height: 600, r: 203, g: 213, b: 225 }
];

for (const img of images) {
  const png = generatePNG(img.width, img.height, img.r, img.g, img.b);
  fs.writeFileSync(img.path, png);
  console.log(`Generated ${img.path}`);
}

console.log('All placeholder images generated successfully!');
