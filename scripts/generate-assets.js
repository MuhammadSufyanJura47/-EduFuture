// Simple pure Node.js PNG generator with zlib
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, drawFn) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const idx = (y * width + x) * 4;
      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // PNG Filter type 0 for each scanline
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0; // Filter byte
    buffer.copy(scanlines, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines);

  function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Generate 256x256 logo (Emerald green emblem with clean geometry and solid colors)
const logoPng = createPNG(256, 256, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const dist = Math.hypot(x - cx, y - cy);
  
  // Rounded square emblem background in deep emerald #0D5C3A (13, 92, 58)
  const isInsideBox = Math.abs(x - cx) < 100 && Math.abs(y - cy) < 100;
  if (isInsideBox) {
    // Inner emblem shape (white/gold geometric academy compass & star)
    const innerDist = Math.hypot(x - cx, y - cy);
    // Draw star / diamond shape
    const manhattan = Math.abs(x - cx) + Math.abs(y - cy);
    if (manhattan < 50) {
      return [255, 255, 255, 255]; // Pure crisp white core
    }
    // Hexagonal ring or accent
    if (manhattan > 55 && manhattan < 75) {
      return [245, 158, 11, 255]; // Amber gold accent #F59E0B
    }
    return [13, 92, 58, 255]; // Deep Emerald #0D5C3A
  }
  return [0, 0, 0, 0]; // Transparent
});

// Generate 32x32 favicon
const faviconPng = createPNG(32, 32, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const isInside = Math.abs(x - cx) < 14 && Math.abs(y - cy) < 14;
  if (isInside) {
    const manhattan = Math.abs(x - cx) + Math.abs(y - cy);
    if (manhattan < 8) {
      return [255, 255, 255, 255];
    }
    return [13, 92, 58, 255];
  }
  return [0, 0, 0, 0];
});

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'logo.png'), logoPng);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconPng);
console.log('Successfully generated /public/logo.png and /public/favicon.ico');
