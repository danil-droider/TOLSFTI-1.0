const fs = require('fs');
const zlib = require('zlib');

// PNG signature (8 bytes)
const pngSignature = Buffer.from([13, 72, 68, 65, 84, 8, 26, 10]);

// Use Node 22's zlib.crc32 if available, otherwise fallback
let crc32;
try {
  // Test if zlib.crc32 exists
  const testBuf = Buffer.from('test');
  zlib.crc32(testBuf);
  crc32 = zlib.crc32;
  console.log('Using zlib.crc32');
} catch (e) {
  console.log('zlib.crc32 not available, using fallback');
  // Build CRC32 table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? (c >>> 1) ^ 0xEDB88320 : c >>> 1;
    }
    crcTable[i] = c;
  }
  crc32 = (buf) => {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
    }
    return (crc >>> 0) ^ 0xFFFFFFFF;
  };
}

function createChunk(type, data) {
  const length = data.length;
  const typeBuf = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcData);
  const chunk = Buffer.alloc(4 + 4 + length + 4);
  chunk.writeUInt32BE(length, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 4 + 4);
  chunk.writeUInt32BE(crc >>> 0, 4 + 4 + length);
  return chunk;
}

function createSolidPNG(width, height, r, g, b, a, filename) {
  // IHDR: 13 bytes
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);  // bit depth
  ihdr.writeUInt8(6, 9);  // color type: RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  // Pixel data: each row starts with filter byte (0), then width RGBA pixels
  const rowStride = width * 4 + 1; // filter byte + pixels
  const pixelData = Buffer.alloc(height * rowStride);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowStride;
    pixelData[rowStart] = 0; // filter type = None
    const pixelRow = pixelData.slice(rowStart + 1);
    for (let x = 0; x < width; x++) {
      const px = x * 4;
      pixelRow[px] = r;
      pixelRow[px + 1] = g;
      pixelRow[px + 2] = b;
      pixelRow[px + 3] = a;
    }
  }

  // Compress with deflate
  const compressed = zlib.deflateSync(pixelData);

  // Build IDAT chunk
  const idat = createChunk('IDAT', compressed);

  // Build IEND chunk (empty data)
  const iend = createChunk('IEND', Buffer.alloc(0));

  // Final PNG
  const buffer = Buffer.concat([pngSignature, createChunk('IHDR', ihdr), idat, iend]);
  fs.writeFileSync(filename, buffer);
  console.log(`Generated: ${filename} (${width}x${height})`);
}

createSolidPNG(192, 192, 0x12, 0x12, 0x12, 0xFF, 'public/icon-192.png');
createSolidPNG(512, 512, 0x12, 0x12, 0x12, 0xFF, 'public/icon-512.png');
createSolidPNG(180, 180, 0x12, 0x12, 0x12, 0xFF, 'public/apple-touch-icon.png');

console.log('All icons generated successfully.');