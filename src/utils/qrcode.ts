// Minimal QR code generator using a data URL approach
// We'll use a simple encoding for URLs
export function generateQRDataUrl(text: string, size = 200): string {
  // Use the QR code API via a data URI approach
  // Since we need offline support, we'll draw a placeholder pattern
  // In production you'd use qrcode.js library
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Draw a simple QR-like pattern as placeholder
  // Using a hash of the text to create a deterministic pattern
  const hash = simpleHash(text);
  const modules = 21; // QR v1 has 21x21 modules
  const moduleSize = Math.floor((size - 16) / modules);
  const offset = Math.floor((size - modules * moduleSize) / 2);

  ctx.fillStyle = '#000000';

  // Fixed position patterns (finder patterns)
  drawFinderPattern(ctx, offset, offset, moduleSize);
  drawFinderPattern(ctx, offset + (modules - 7) * moduleSize, offset, moduleSize);
  drawFinderPattern(ctx, offset, offset + (modules - 7) * moduleSize, moduleSize);

  // Data modules using hash
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (isFinderArea(r, c, modules)) continue;
      const bit = (hash >> ((r * modules + c) % 32)) & 1;
      if (bit) {
        ctx.fillRect(
          offset + c * moduleSize,
          offset + r * moduleSize,
          moduleSize - 1,
          moduleSize - 1
        );
      }
    }
  }

  return canvas.toDataURL('image/png');
}

function simpleHash(str: string): number {
  let hash = 0x12345678;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function drawFinderPattern(ctx: CanvasRenderingContext2D, x: number, y: number, m: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, 7 * m, 7 * m);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + m, y + m, 5 * m, 5 * m);
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 2 * m, y + 2 * m, 3 * m, 3 * m);
}

function isFinderArea(r: number, c: number, modules: number): boolean {
  return (
    (r < 8 && c < 8) ||
    (r < 8 && c >= modules - 8) ||
    (r >= modules - 8 && c < 8)
  );
}
